import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of the competition's games, named by its id, was corrected to
 * new scores, each as it was typed, its winner and loser staying as they
 * were. Whether the winner's score is marked as the winner's is said as well,
 * as it is when a game is added.
 */
export class CompetitionGameCorrected extends DomainEvent {
  constructor(
    readonly gameId: string,
    readonly winnerScore: string,
    readonly winnerMarked: boolean,
    readonly loserScore: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
