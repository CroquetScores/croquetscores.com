import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's players was archived. The player is named by
 * their id, as text, as every event names what it is about.
 */
export class TournamentPlayerArchived extends DomainEvent {
  constructor(
    readonly playerId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
