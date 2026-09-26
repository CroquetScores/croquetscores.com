import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Archiving one of a tournament's players. Whether they have played any games
 * is asked of the application's games.
 */
export class ArchivePlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The player, by their id. */
    readonly playerId: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
