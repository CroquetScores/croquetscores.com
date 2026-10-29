import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account was linked to the Facebook account Facebook knows as
 * `facebookId`. The id rather than the email address, because an id is never
 * given to another Facebook account and an email address can be.
 */
export class FacebookAccountLinked extends DomainEvent {
  constructor(
    readonly facebookId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
