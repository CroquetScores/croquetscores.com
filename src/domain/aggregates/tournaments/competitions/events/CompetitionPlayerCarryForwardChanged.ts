import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";
import type { CarryForwardCounts } from "../value-objects/CarryForward.js";

/**
 * That what one of the competition's players carries forward was changed, to
 * every count it says. A count it says nothing of is nothing carried forward,
 * and is left out when it is written down.
 */
export class CompetitionPlayerCarryForwardChanged extends DomainEvent {
  // Each count a field of its own, rather than one field holding all six, so
  // that what is written down reads as what happened.
  readonly matchWins: number | undefined;
  readonly matchLosses: number | undefined;
  readonly gameWins: number | undefined;
  readonly gameLosses: number | undefined;
  readonly hoopsFor: number | undefined;
  readonly hoopsAgainst: number | undefined;

  constructor(
    readonly playerId: string,
    counts: CarryForwardCounts,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
    this.matchWins = counts.matchWins;
    this.matchLosses = counts.matchLosses;
    this.gameWins = counts.gameWins;
    this.gameLosses = counts.gameLosses;
    this.hoopsFor = counts.hoopsFor;
    this.hoopsAgainst = counts.hoopsAgainst;
  }

  /** Every count it says, nothing where nothing is carried forward. */
  get counts(): CarryForwardCounts {
    return {
      matchWins: this.matchWins,
      matchLosses: this.matchLosses,
      gameWins: this.gameWins,
      gameLosses: this.gameLosses,
      hoopsFor: this.hoopsFor,
      hoopsAgainst: this.hoopsAgainst,
    };
  }
}
