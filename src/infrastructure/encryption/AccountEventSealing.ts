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
// The key is made as the event an account begins with is kept, and deleted as
// its forgetting is, each in the transaction of that append, so that an account
// is never kept without its key, nor forgotten without losing it.
//
// A forgotten account still has to be called something and reached at an email
// address wherever it is read back. It is called "Account Forgotten" and the
// uuid in its id, and reached at "account-forgotten-", the uuid, and the site's
// own domain, which nothing is ever sent to. A Google account it was linked to
// reads back as "google-account-forgotten-" and the uuid, which no Google
// account is known by, since Google knows every one by digits alone. The uuid is
// the id's, so that the account reads back the same every time.
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { KeptEvent } from "../../domain/common/EventRegistry.js";
import type { KeptEventSealing } from "../event-store/PostgresEventStore.js";
import type { AccountKeys } from "./AccountKeys.js";

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

// The events an account begins with, either of which is when its key is made.
const beginnings: readonly string[] = [
  "account-registered",
  "account-brought-over",
];

const uuidOf = (account: AccountId): string =>
  account.value.slice(account.value.indexOf("/") + 1);

// What a forgotten account is read back as, field by field.
const forgotten = (field: string, account: AccountId): string => {
  if (field === "name") return `Account Forgotten ${uuidOf(account)}`;
  if (field === "subject") return `google-account-forgotten-${uuidOf(account)}`;
  return `account-forgotten-${uuidOf(account)}@croquetscores.com`;
};

export class AccountEventSealing implements KeptEventSealing {
  constructor(private readonly keys: AccountKeys) {}

  async seal(stream: string, kept: KeptEvent): Promise<KeptEvent> {
    if (beginnings.includes(kept.name)) {
      await this.keys.makeFor(AccountId.from(stream));
    }
    if (kept.name === "account-forgotten") {
      await this.keys.forget(AccountId.from(stream));
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
    const fields = personal[kept.name];
    if (fields === undefined) return kept;

    const account = AccountId.from(stream);
    const data = { ...kept.data };
    for (const field of fields) {
      const value = data[field];
      if (typeof value === "string") {
        data[field] =
          (await this.keys.decrypt(account, value)) ??
          forgotten(field, account);
      }
    }
    return { name: kept.name, data };
  }
}
