import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a player was added to one of the tournament's teams, with their name
 * and the order within the team the tournament gave them.
 */
export class TeamPlayerAdded extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly playerId: string,
    readonly name: string,
    // Where the player comes when the team lists its players, lowest first.
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
