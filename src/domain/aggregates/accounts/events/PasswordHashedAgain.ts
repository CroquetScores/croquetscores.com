import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../value-objects/AccountId.js";

/** That the account's password was hashed again, and what the hash now is. */
export class PasswordHashedAgain extends DomainEvent {
  constructor(
    readonly passwordHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
