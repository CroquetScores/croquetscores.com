import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentPlayerDetails } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";

/**
 * Correcting one of a tournament's players: everything they are, said again.
 */
export class UpdatePlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The player, by their id. */
    readonly playerId: string,
    /** What the player is: their name, and what they represent and the flag they fly, if either. */
    readonly player: TournamentPlayerDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
