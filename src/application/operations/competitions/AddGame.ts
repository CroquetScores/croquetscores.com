import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Every rule a game to be added can break on the way in. */
export type AddGameErrorCode =
  | "Game.WinnerMissing"
  | "Game.WinnerScoreMissing"
  | "Game.LoserMissing"
  | "Game.LoserScoreMissing";

/** What a game to be added says, as it was chosen and typed. */
export interface GameRequest {
  /** The winner, by their id in the competition. */
  readonly winner?: string | undefined;
  /** The winner's score as it was typed, as "26" or "6w". */
  readonly winnerScore?: string | undefined;
  readonly loser?: string | undefined;
  readonly loserScore?: string | undefined;
}

/**
 * Adding a game's score to one of a tournament's competitions, answered with
 * the id the game is given.
 */
export class AddGame extends Command<string> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    readonly game: GameRequest,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
