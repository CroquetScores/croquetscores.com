import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";
import type { GameId } from "./primitives/GameId.js";
import type { Score } from "./value-objects/Score.js";

/** Every rule a game can break, besides those of a score. */
export type GameErrorCode =
  "Game.SamePlayer" | "Game.WinnerNotAhead" | "Game.LoserMarked";

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
 * A game is never altered: archiving and restoring each give the game as it
 * is afterwards. Two games are the same game when their ids are, since two
 * games between the same players can have the same scores.
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
