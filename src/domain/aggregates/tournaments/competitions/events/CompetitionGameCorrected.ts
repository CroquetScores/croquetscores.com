import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of the competition's games, named by its id, was corrected to
 * new scores, each as it was typed. Whether the winner's score is marked as
 * the winner's is said as well, as it is when a game is added.
 */
export class CompetitionGameCorrected extends DomainEvent {
  constructor(
    readonly gameId: string,
    readonly winnerScore: string,
    readonly winnerMarked: boolean,
    readonly loserScore: string,
    // The players it was corrected to, only where the correction changed
    // them, which JSON leaves out otherwise. Every correction kept before
    // players could be changed kept them, and says none, so none means the
    // game's own.
    readonly winnerId: string | undefined,
    readonly loserId: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
