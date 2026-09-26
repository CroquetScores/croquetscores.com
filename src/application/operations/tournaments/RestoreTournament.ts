import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Restoring an archived tournament. It names the account the reader is signed in to, and the
 * tournament by its id.
 */
export class RestoreTournament extends Command<void> {
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
