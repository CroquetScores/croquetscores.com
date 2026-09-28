import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's players was moved, by being given the order
 * they now have. Only the one moved is said: the others keep theirs, since
 * the player is given an order between the two they now come between.
 */
export class TournamentPlayerMoved extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
