import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's Swisses is now called this and is the best of
 * this. Its slug and its order are not said, because updating keeps them.
 */
export class SwissUpdated extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly bestOf: number,
    // How the competition is played and counted (CompetitionRules).
    readonly handicap: boolean,
    readonly drawsAllowed: boolean,
    readonly worldRankings: boolean,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
