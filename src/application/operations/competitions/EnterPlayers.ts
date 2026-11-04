import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { Command } from "../../common/Command.js";

/**
 * The most players one list may hold. The list is entered in one save, and
 * each player is asked about against every one already in the competition, so
 * a list with no end would make the work grow with the square of its length.
 */
export const mostPlayersAtOnce = 500;

/**
 * What came of the list: the ids the players entered were given, in the order
 * they were listed, and the players who were not entered, each as the rule it
 * broke and the place it was listed at (`players.0` is the first). Nobody is
 * left out without being said, so a caller that asked for what can be entered
 * need not work out who was skipped by comparing what it sent with what came
 * back.
 */
export interface EnterPlayersAnswer {
  readonly entered: readonly string[];
  readonly refused: readonly BrokenRule[];
}

/**
 * Entering several of a tournament's players in one of its competitions at
 * once, answered with the ids they are given in the competition, in the order
 * they were listed.
 *
 * The list is entered whole or not at all, unless `enterWhatCan` is so, which
 * says the person asking has been told which players cannot be entered and has
 * chosen to enter the rest.
 */
export class EnterPlayers extends Command<EnterPlayersAnswer> {
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
