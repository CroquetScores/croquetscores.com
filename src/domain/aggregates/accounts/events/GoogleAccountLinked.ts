import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account was linked to the Google account Google knows as
 * `subject`. The subject rather than the email address, because a subject is
 * never given to another Google account and an email address can be.
 */
export class GoogleAccountLinked extends DomainEvent {
  constructor(
    readonly subject: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
