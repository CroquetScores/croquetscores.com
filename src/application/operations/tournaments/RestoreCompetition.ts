import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Restoring one of a tournament's archived competitions, of whatever kind.
 */
export class RestoreCompetition extends Command<void> {
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
