import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Archiving one of a tournament's competitions, of whatever kind. Whether it
 * has any games is asked of the application's games.
 */
export class ArchiveCompetition extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
