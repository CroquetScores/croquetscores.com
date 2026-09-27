import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** Every rule a move can break on the way in. */
export type MoveCompetitionErrorCode = "MoveCompetition.NoSuchDirection";

/**
 * Moving one of a tournament's competitions up or down a place among those
 * not archived, of whatever kind.
 */
export class MoveCompetition extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** Which way it is moved: "up" or "down", and nothing else. */
    readonly direction: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
