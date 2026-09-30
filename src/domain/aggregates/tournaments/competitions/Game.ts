import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";
import type { GameId } from "./primitives/GameId.js";
import type { Score } from "./value-objects/Score.js";

/** Every rule a game can break, besides those of a score. */
export type GameErrorCode =
  | "Game.SamePlayer"
  | "Game.WinnerNotAhead"
  | "Game.LoserMarked"
  | "Game.ResultChanged"
  | "Game.Archived";

/** What a game is, as it is given. */
export interface GameDetails {
  readonly winner: CompetitionPlayerId;
  readonly winnerScore: Score;
  readonly loser: CompetitionPlayerId;
  readonly loserScore: Score;
}

/**
 * A game played between two of a competition's players, said as the result
 * is said aloud: the winner and their score, and the loser and theirs.
 *
 * The winner made at least as many points as the loser. A game on equal
 * points says who won it by marking the winner's score, unless the tournament
 * allows drawn games, which few do; then it is kept as it was entered, and
 * one with no mark is drawn, won by neither.
 *
 * A game entered with the wrong score is corrected, keeping its result, and
 * with other players where the competition allows it. An archived game is
 * not changed in any way, so it is not corrected.
 *
 * A game is never altered: archiving, restoring and correcting each give the
 * game as it is afterwards. Two games are the same game when their ids are,
 * since two games between the same players can have the same scores.
 */
export class Game {
  readonly #id: GameId;
  readonly #details: GameDetails;
  readonly #archived: boolean;

  private constructor(id: GameId, details: GameDetails, archived: boolean) {
    this.#id = id;
    this.#details = details;
    this.#archived = archived;
  }

  /**
   * The game known by `id` that `details` describe, not archived. Whether
   * drawn games are allowed is the tournament's, so whatever makes the game
   * says. Throws {@link ValidationError} naming the first rule broken.
   */
  static from(
    id: GameId,
    details: GameDetails,
    { drawsAllowed }: { readonly drawsAllowed: boolean },
  ): Game {
    const { winner, winnerScore, loser, loserScore } = details;
    if (winner.equals(loser)) refuse("Game.SamePlayer");
    if (loserScore.marked) refuse("Game.LoserMarked");
    // Fewer points is a game put down the wrong way round, marked or not; as
    // many says nobody won unless it is marked, or draws are allowed.
    if (
      loserScore.isMoreThan(winnerScore) ||
      (!winnerScore.isMoreThan(loserScore) &&
        !winnerScore.marked &&
        !drawsAllowed)
    ) {
      refuse("Game.WinnerNotAhead");
    }
    return new Game(id, details, false);
  }

  get id(): GameId {
    return this.#id;
  }

  get winner(): CompetitionPlayerId {
    return this.#details.winner;
  }

  get winnerScore(): Score {
    return this.#details.winnerScore;
  }

  get loser(): CompetitionPlayerId {
    return this.#details.loser;
  }

  get loserScore(): Score {
    return this.#details.loserScore;
  }

  /** Whether it is on equal points with no mark, and so won by neither. */
  get drawn(): boolean {
    return (
      !this.winnerScore.isMoreThan(this.loserScore) && !this.winnerScore.marked
    );
  }

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * The game, with `winnerScore` and `loserScore` in place of its own, and
   * `players` in place of its own where they are given, its result kept: a
   * game won still won, and a drawn game still drawn. Whether its players
   * may be changed is the competition's to say, so it is not asked here.
   * Throws {@link ValidationError} naming the first rule broken, as making
   * the game with them would, `Game.ResultChanged` where the result would
   * change, and `Game.Archived` for an archived game.
   */
  correct(
    winnerScore: Score,
    loserScore: Score,
    { drawsAllowed }: { readonly drawsAllowed: boolean },
    players?: {
      readonly winner: CompetitionPlayerId;
      readonly loser: CompetitionPlayerId;
    },
  ): Game {
    if (this.#archived) refuse("Game.Archived");
    // A loser put ahead is refused here, as a game the wrong way round.
    const corrected = Game.from(
      this.#id,
      { ...this.#details, ...players, winnerScore, loserScore },
      { drawsAllowed },
    );
    if (corrected.drawn !== this.drawn) refuse("Game.ResultChanged");
    return corrected;
  }

  /** The game, archived. */
  archive(): Game {
    return this.#archived ? this : new Game(this.#id, this.#details, true);
  }

  /** The game, no longer archived. */
  restore(): Game {
    return this.#archived ? new Game(this.#id, this.#details, false) : this;
  }

  equals(other: Game | undefined): boolean {
    return other instanceof Game && this.#id.equals(other.#id);
  }

  toString(): string {
    return `${String(this.winnerScore)} to ${String(this.loserScore)}`;
  }
}

const refuse = (code: GameErrorCode): never => {
  throw new ValidationError<GameErrorCode>(code);
};
