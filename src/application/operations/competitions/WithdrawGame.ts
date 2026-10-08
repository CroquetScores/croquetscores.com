import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Withdrawing a score from what counts in a block or a Swiss, where it was played but is not to count. */
export class WithdrawGame extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The game, by its id. */
    readonly gameId: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
