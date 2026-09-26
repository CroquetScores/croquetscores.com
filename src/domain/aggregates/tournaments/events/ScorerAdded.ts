import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That an account was made a scorer of the tournament. The account is named
 * by its id, as text, as every event names what it is about.
 */
export class ScorerAdded extends DomainEvent {
  constructor(
    readonly account: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
