import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TeamPlayerId } from "../../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { TeamPlayerDetails } from "../../../domain/aggregates/tournaments/TeamPlayer.js";

/**
 * Adding a player to one of a tournament's teams. It is answered with the new
 * player's id.
 */
export class AddTeamPlayer extends Command<TeamPlayerId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** What the player is: their name. */
    readonly player: TeamPlayerDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
