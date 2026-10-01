import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TeamPlayerDetails } from "../../../domain/aggregates/tournaments/TeamPlayer.js";

/** Correcting the name of a player in one of a tournament's teams. */
export class UpdateTeamPlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** The player, by their id in their team. */
    readonly playerId: string,
    /** What the player is now. */
    readonly details: TeamPlayerDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
