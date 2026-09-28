import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's players was archived. The player is named by
 * their id, as text, as every event names what it is about. An archived player
 * is put last, so the order they were given is said with it.
 */
export class TournamentPlayerArchived extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
