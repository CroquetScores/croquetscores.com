import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account was given a new password, and what its hash now is.
 *
 * Told apart from the password being hashed again, which keeps the same
 * password and makes a better hash of it: this is somebody choosing another
 * password, and it is what spends the link that set it.
 */
export class PasswordSet extends DomainEvent {
  constructor(
    readonly passwordHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
