import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a player in one of the tournament's teams was archived. An archived
 * player is put last in their team, so the order they were given is said with
 * it.
 */
export class TeamPlayerArchived extends DomainEvent {
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
