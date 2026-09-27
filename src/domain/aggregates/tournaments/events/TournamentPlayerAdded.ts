import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a player was added to the tournament, with everything they were added
 * as. It holds what it says as text rather than as the values it came from, as
 * every event does, so that it is written down as what it says.
 */
export class TournamentPlayerAdded extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly name: string,
    // Nothing when the player represents nothing, which JSON leaves out.
    readonly representing: string | undefined,
    // The name of the flag the player flies, or nothing when they fly none.
    readonly flag: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
