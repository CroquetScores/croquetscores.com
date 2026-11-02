import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's knockouts is now called this and has a draw of
 * this shape. Its slug and its order are not said, because updating keeps
 * them.
 */
export class KnockoutUpdated extends DomainEvent {
  // What each round is the best of, the first round first.
  readonly rounds: readonly number[];

  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly places: number,
    rounds: readonly number[],
    // How the competition is played and counted (CompetitionRules).
    readonly handicap: boolean,
    readonly drawsAllowed: boolean,
    readonly worldRankings: boolean,
    // The most hoops a game is played to, or null for no most. Left out by an
    // event kept before it was said, which the tournament then reads as the
    // usual for its sport.
    readonly maximumHoops: number | null | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
    // A copy, frozen, so that nothing holding the list it was given can change
    // what the event says.
    this.rounds = Object.freeze([...rounds]);
  }
}
