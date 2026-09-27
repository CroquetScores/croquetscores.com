import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's competitions was moved, by being given the
 * order it now has. Only the one moved is said: the others keep theirs, since
 * it is given an order between the two it now comes between.
 */
export class CompetitionMoved extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
