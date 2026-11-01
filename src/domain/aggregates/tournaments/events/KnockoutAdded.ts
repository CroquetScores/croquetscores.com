import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a knockout was added to the tournament: its id, its name, the slug and
 * the order the tournament gave it, and the shape of its draw. A losers
 * knockout also says which knockout's losers fill it, and from which round.
 */
export class KnockoutAdded extends DomainEvent {
  // What each round is the best of, the first round first.
  readonly rounds: readonly number[];

  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly slug: string,
    readonly order: number,
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
    // Left out of every knockout added before losers knockouts, and of one
    // whose players are set by hand. The round is the first being 0.
    readonly losersOfCompetitionId?: string,
    readonly losersOfRound?: number,
  ) {
    super(createdBy, occurredAt);
    // A copy, frozen, so that nothing holding the list it was given can change
    // what the event says.
    this.rounds = Object.freeze([...rounds]);
  }
}
