import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentPlayerDetails } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";

/**
 * Adding a player to a tournament. It is answered with the new player's id.
 */
export class AddPlayer extends Command<TournamentPlayerId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the player is: their name, and what they represent and the flag they fly, if either. */
    readonly player: TournamentPlayerDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
