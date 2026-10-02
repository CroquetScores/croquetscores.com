import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/** That a player in one of the tournament's teams was given a new order within it. */
export class TeamPlayerMoved extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly playerId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
