// What is personal in an account's events — its name, its email address and the
// Google account linked to it — encrypted with the account's own key as the
// events are kept, and decrypted as they are read back. The address is in the
// event an account begins with, and the name in its confirming, which is where
// it is given, and in any change of it since; an account brought over from the
// old site begins with both. The Google account is kept by the subject Google
// knows it by, which reads as nothing to anybody, but is the same for that
// person on every site signing in with Google, and so would tie a forgotten
// account to them if kept as given.
//
// The key is made as the event an account begins with is kept, in the
// transaction of that append, so that an account is never kept without its key.
//
// An account is forgotten by rewriting its events, which is the one place the
// site changes what it has kept. As the event that records the forgetting is
// kept, in the same transaction, every event of the account that holds a name,
// an email address or a Google account is rewritten to hold what a forgotten
// account is called instead, encrypted with the account's key as it was
// before, and the key is kept and marked forgotten. What was kept of the person
// is then kept no longer, and not merely out of reach of a key.
//
// A forgotten account is called "Forgotten Account" and the uuid in its id, and
// reached at "forgotten-account-", the uuid without its hyphens, and
// example.com, which nobody owns and nothing is ever sent to. A Google account
// it was linked to reads back as "google-account-forgotten-" and the uuid,
// which no Google account is known by, since Google knows every one by digits
// alone. The uuid is the id's, so that the account reads back the same every
// time.
//
// What other sites an account may be linked to, Facebook among them, holds
// another subject that would tie a forgotten account to the person, and is
// added to `personal` when its event is, so that it is rewritten with the rest.
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import {
  forgottenEmailAddressOf,
  forgottenGoogleSubjectOf,
  forgottenNameOf,
} from "../../domain/aggregates/accounts/forgottenAccount.js";
import type { KeptEvent } from "../../domain/common/EventRegistry.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { KeptEventSealing } from "../event-store/PostgresEventStore.js";
import { type AccountKeys, AccountKeysRefused } from "./AccountKeys.js";

// Which of an account's events hold something personal, and which fields.
const personal: Readonly<Record<string, readonly string[]>> = {
  "account-registered": ["emailAddress"],
  "account-brought-over": ["name", "emailAddress"],
  "account-email-address-confirmed": ["name"],
  "account-name-changed": ["name"],
  "account-email-address-change-asked": ["emailAddress"],
  "account-email-address-changed": ["emailAddress"],
  "account-google-account-linked": ["subject"],
};

/**
 * The kinds of account event forgetting rewrites. A kind of event that holds
 * something personal and is not here would keep the person for good
 * (AccountKeys.feature).
 */
export const eventsForgettingRewrites: readonly string[] =
  Object.keys(personal);

// The events an account begins with, either of which is when its key is made.
const beginnings: readonly string[] = [
  "account-registered",
  "account-brought-over",
];

// What a forgotten account is read back as, field by field.
const forgotten = (field: string, account: AccountId): string => {
  if (field === "name") return forgottenNameOf(account);
  if (field === "subject") return forgottenGoogleSubjectOf(account);
  return forgottenEmailAddressOf(account);
};

export class AccountEventSealing implements KeptEventSealing {
  constructor(
    private readonly keys: AccountKeys,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  // Asked of what the events hold and not of the key's flag, which says the
  // account is forgotten and not that its events were rewritten: an account
  // marked forgotten whose events were not is repaired here.
  async #rewrite(account: AccountId): Promise<void> {
    await this.keys.ensureFor(account);
    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<{
      version: number;
      name: string;
      data: Record<string, unknown>;
    }>(
      `select version, name, data from events
        where stream_id = $1 and name = any($2) order by version`,
      [account.value, Object.keys(personal)],
    );
    let rewrote = false;
    for (const { version, name, data } of rows) {
      const rewritten = { ...data };
      let changed = false;
      for (const field of personal[name] ?? []) {
        const kept = rewritten[field];
        if (typeof kept !== "string") continue;
        const replacement = forgotten(field, account);
        if (await this.#holds(account, kept, replacement)) continue;
        rewritten[field] = await this.keys.encrypt(account, replacement);
        changed = true;
      }
      if (!changed) continue;
      rewrote = true;
      await connection.query(
        `update events set data = $3 where stream_id = $1 and version = $2`,
        [account.value, version, rewritten],
      );
    }
    // Emails waiting for the account are sealed with its key, which is kept, so
    // they are taken out rather than left to be opened by whoever has the key.
    // Asked only when something was rewritten: an account rewritten before had
    // them taken out then, and nothing has been queued for it since.
    if (rewrote) {
      await connection.query(`delete from email_queue where account_id = $1`, [
        account.value,
      ]);
    }
    await this.keys.forget(account);
  }

  // Whether `kept` is already `replacement`, encrypted with the account's key.
  // What was encrypted with another key is not: it was kept before the account
  // had this one, and is the rewriting's to replace.
  async #holds(
    account: AccountId,
    kept: string,
    replacement: string,
  ): Promise<boolean> {
    try {
      return (await this.keys.decrypt(account, kept)) === replacement;
    } catch (failure) {
      if (failure instanceof AccountKeysRefused) return false;
      throw failure;
    }
  }

  async seal(stream: string, kept: KeptEvent): Promise<KeptEvent> {
    if (beginnings.includes(kept.name)) {
      await this.keys.makeFor(AccountId.from(stream));
    }
    if (kept.name === "account-forgotten") {
      await this.#rewrite(AccountId.from(stream));
    }
    const fields = personal[kept.name];
    if (fields === undefined) return kept;

    const account = AccountId.from(stream);
    const data = { ...kept.data };
    for (const field of fields) {
      const value = data[field];
      if (typeof value === "string") {
        data[field] = await this.keys.encrypt(account, value);
      }
    }
    return { name: kept.name, data };
  }

  async open(stream: string, kept: KeptEvent): Promise<KeptEvent> {
    return (await this.openAll(stream, [kept]))[0] as KeptEvent;
  }

  // The account's key is looked up once for all of its events, and only when
  // one of them holds something personal.
  async openAll(
    stream: string,
    events: readonly KeptEvent[],
  ): Promise<readonly KeptEvent[]> {
    if (!events.some(({ name }) => personal[name] !== undefined)) return events;

    const account = AccountId.from(stream);
    const decrypt = await this.keys.decryptor(account);
    return events.map((kept) => {
      const fields = personal[kept.name];
      if (fields === undefined) return kept;
      const data = { ...kept.data };
      for (const field of fields) {
        const value = data[field];
        if (typeof value === "string") {
          data[field] = decrypt(value) ?? forgotten(field, account);
        }
      }
      return { name: kept.name, data };
    });
  }
}
