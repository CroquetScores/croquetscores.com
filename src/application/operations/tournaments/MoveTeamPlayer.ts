/** Every rule a move can break on the way in. */
export type MoveTeamPlayerErrorCode = "MoveTeamPlayer.NoSuchDirection";

import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Moving a player in one of a tournament's teams up or down a place among the
 * team's players in use.
 */
export class MoveTeamPlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** The player, by their id in their team. */
    readonly playerId: string,
    /** Which way it is moved: "up" or "down", and nothing else. */
    readonly direction: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
