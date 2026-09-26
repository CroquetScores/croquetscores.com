import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Archiving a tournament. It names the account the reader is signed in to, and the
 * tournament by its id.
 */
export class ArchiveTournament extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
