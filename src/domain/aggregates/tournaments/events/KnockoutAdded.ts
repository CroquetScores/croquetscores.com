import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a knockout was added to the tournament: its id, its name, the slug and
 * the order the tournament gave it, and the shape of its draw.
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
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
    // A copy, frozen, so that nothing holding the list it was given can change
    // what the event says.
    this.rounds = Object.freeze([...rounds]);
  }
}
