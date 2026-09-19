// What is personal in an account's events — its name and its email address —
// encrypted with the account's own key as the events are kept, and decrypted as
// they are read back. The key is made as the account's registering is kept, and
// deleted as its forgetting is, each in the transaction of that append, so that
// an account is never kept without its key, nor forgotten without losing it.
//
// A forgotten account still has to be called something and reached at an email
// address wherever it is read back. It is called "Account Forgotten" and the
// uuid in its id, and reached at "account-forgotten-", the uuid, and the site's
// own domain, which nothing is ever sent to. The uuid is the id's, so that the
// account reads back the same every time.
import { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { KeptEvent } from "../../domain/common/EventRegistry.js";
import type { KeptEventSealing } from "../event-store/PostgresEventStore.js";
import type { AccountKeys } from "./AccountKeys.js";

// Which of an account's events hold something personal, and which fields.
const personal: Readonly<Record<string, readonly string[]>> = {
  "account-registered": ["name", "emailAddress"],
};

const uuidOf = (account: AccountId): string =>
  account.value.slice(account.value.indexOf("/") + 1);

// What a forgotten account is read back as, field by field.
const forgotten = (field: string, account: AccountId): string =>
  field === "name"
    ? `Account Forgotten ${uuidOf(account)}`
    : `account-forgotten-${uuidOf(account)}@croquetscores.com`;

export class AccountEventSealing implements KeptEventSealing {
  constructor(private readonly keys: AccountKeys) {}

  async seal(stream: string, kept: KeptEvent): Promise<KeptEvent> {
    if (kept.name === "account-registered") {
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
