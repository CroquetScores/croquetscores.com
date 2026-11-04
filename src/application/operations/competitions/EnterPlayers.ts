import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * The most players one list may hold. The list is entered in one save, and
 * each player is asked about against every one already in the competition, so
 * a list with no end would make the work grow with the square of its length.
 */
export const mostPlayersAtOnce = 500;

/**
 * Entering several of a tournament's players in one of its competitions at
 * once, answered with the ids they are given in the competition, in the order
 * they were listed.
 *
 * The list is entered whole or not at all, unless `enterWhatCan` is so, which
 * says the person asking has been told which players cannot be entered and has
 * chosen to enter the rest.
 */
export class EnterPlayers extends Command<readonly string[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The tournament's players, by their ids, in the order listed. */
    readonly playerIds: readonly string[],
    /** Whether the players who can be entered are, where not all can be. */
    readonly enterWhatCan: boolean,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
