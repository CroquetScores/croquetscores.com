import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account made a key for an app. It holds a hash of the key and never
 * the key, which the account's maker is shown once and the site never has
 * again. Its label is what the maker typed, so it is as personal as a name:
 * whatever keeps the account's events keeps it as it keeps a name.
 *
 * `tournament` is the id of the one tournament the key is limited to, written
 * as text, and left out where it is limited to none. Its limits are a number of
 * requests a minute and a day.
 */
export class ApiKeyCreated extends DomainEvent {
  constructor(
    readonly keyId: string,
    readonly keyHash: string,
    readonly label: string,
    readonly scope: string,
    readonly tournament: string | undefined,
    readonly perMinute: number,
    readonly perDay: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
