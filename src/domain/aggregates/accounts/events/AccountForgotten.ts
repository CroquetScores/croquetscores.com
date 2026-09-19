import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../value-objects/AccountId.js";

/**
 * That the account was forgotten. It says nothing about the person: what is
 * kept of them is made unreadable by deleting the account's key, and this is
 * what tells everything reading the account's events to stop finding it.
 */
export class AccountForgotten extends DomainEvent {
  constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    super(createdBy, occurredAt);
  }
}
