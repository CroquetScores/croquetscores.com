import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Archiving a player in one of a tournament's teams. Whether they have played
 * any games is asked of the application's games.
 */
export class ArchiveTeamPlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** The player, by their id in their team. */
    readonly playerId: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
