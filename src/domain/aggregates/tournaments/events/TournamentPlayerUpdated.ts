import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's players is now as this says, all of it said
 * again, as updating says it.
 */
export class TournamentPlayerUpdated extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly name: string,
    // Nothing when the player represents nothing, which JSON leaves out.
    readonly represents: string | undefined,
    // The name of the flag the player flies, or nothing when they fly none.
    readonly flag: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
