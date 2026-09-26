import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That an account was taken off the tournament's scorers. The account is
 * named by its id, as text, as every event names what it is about.
 */
export class ScorerRemoved extends DomainEvent {
  constructor(
    readonly account: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
