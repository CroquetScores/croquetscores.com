import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Every rule a move can break on the way in. */
export type MoveCompetitionPlayerErrorCode =
  "MoveCompetitionPlayer.NoSuchDirection";

/**
 * Moving one of a competition's players up or down a place among those who
 * have not withdrawn. Called so, rather than moving a player, so that it is
 * not taken for moving a tournament's player (`MovePlayer`).
 */
export class MoveCompetitionPlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The player, by their id in the competition. */
    readonly playerId: string,
    /** Which way they are moved: "up" or "down", and nothing else. */
    readonly direction: string,
    requestedAt: ReadOnlyDate,
    /**
     * Where the player is a bye, its order in the competition, since every
     * bye has the same id.
     */
    readonly byeOrder?: number,
  ) {
    super(requestedAt);
  }
}
