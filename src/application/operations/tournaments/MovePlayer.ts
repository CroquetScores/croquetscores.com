import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Every rule a move can break on the way in. */
export type MovePlayerErrorCode = "MovePlayer.NoSuchDirection";

/**
 * Moving one of a tournament's players up or down a place among those not
 * archived. A competition's player is moved by `MoveCompetitionPlayer`.
 */
export class MovePlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The player, by their id. */
    readonly playerId: string,
    /** Which way they are moved: "up" or "down", and nothing else. */
    readonly direction: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
