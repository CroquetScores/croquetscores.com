import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the key `keyId` may now make `perMinute` requests a minute and `perDay`
 * a day. Unlike the account's other events it is caused by the administrator
 * who changed them, as a role is by whoever gave it.
 */
export class ApiKeyLimitsChanged extends DomainEvent {
  constructor(
    readonly keyId: string,
    readonly perMinute: number,
    readonly perDay: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
