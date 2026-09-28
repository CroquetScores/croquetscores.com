import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a tournament player was entered in the competition, as a player in it
 * with an id of their own, given the order that puts them after every player
 * already there.
 */
export class CompetitionPlayerEntered extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly tournamentPlayerId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
