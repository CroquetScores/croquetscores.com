import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Entering the losers of one round of a knockout in a competition of the same
 * tournament, usually another knockout, so that those knocked out of the main
 * one do not have to be entered again by hand. It is answered with nothing.
 */
export class EnterLosers extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The knockout the losers come from, by its id. */
    readonly from: string,
    /** The round they lost in, the first being 0. */
    readonly round: number,
    /** The competition they are entered in, by its id. */
    readonly competition: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
