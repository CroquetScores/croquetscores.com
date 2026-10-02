import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Every rule a request to move a score can break on the way in. */
export type MoveGameErrorCode = "MoveGame.NoSuchDirection";

/** Moving a test's score up or down a place, to list them as they were played. */
export class MoveGame extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The test, by its id. */
    readonly competition: string,
    /** The game, by its id. */
    readonly gameId: string,
    /** The way to move it: "up" or "down". */
    readonly direction: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
