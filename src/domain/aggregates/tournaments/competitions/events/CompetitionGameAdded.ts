import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a game was added to the competition: who won and who lost, by their
 * ids in the competition, and each score as it was typed. Whether the
 * winner's score is marked as the winner's is said as well, since which
 * endings are marks is the website's, and the competition does not know it.
 */
export class CompetitionGameAdded extends DomainEvent {
  constructor(
    readonly gameId: string,
    readonly winnerId: string,
    readonly winnerScore: string,
    readonly winnerMarked: boolean,
    readonly loserId: string,
    readonly loserScore: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
