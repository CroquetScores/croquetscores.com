import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Entering one of a tournament's players in one of its competitions, answered
 * with the id the player is given in the competition.
 */
export class EnterPlayer extends Command<string> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The tournament's player, by their id. */
    readonly playerId: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
