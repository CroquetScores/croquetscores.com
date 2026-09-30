import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of a knockout's byes was removed. Every bye has the same id, so it
 * is said by the order it had.
 */
export class CompetitionByeRemoved extends DomainEvent {
  constructor(
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
