import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Reversing the withdrawal of a score, so that it counts again. */
export class ReverseGameWithdrawal extends Command<void> {
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
