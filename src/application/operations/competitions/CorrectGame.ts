import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Every rule corrected scores can break on the way in. */
export type CorrectGameErrorCode =
  "Game.WinnerScoreMissing" | "Game.LoserScoreMissing";

/** A game's scores as they were typed to correct it. */
export interface CorrectedScores {
  /** The winner's score as it was typed, as "26" or "6w". */
  readonly winnerScore?: string | undefined;
  readonly loserScore?: string | undefined;
}

/** Correcting the scores of a game entered wrongly, keeping its result. */
export class CorrectGame extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The game, by its id. */
    readonly gameId: string,
    readonly scores: CorrectedScores,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
