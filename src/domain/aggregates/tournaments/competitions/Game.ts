import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import { TeamPlayerId } from "../primitives/TeamPlayerId.js";
import { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";
import type { GameId } from "./primitives/GameId.js";
import type { Score } from "./value-objects/Score.js";

/** Every rule a game can break, besides those of a score. */
export type GameErrorCode =
  | "Game.SamePlayer"
  | "Game.WinnerNotAhead"
  | "Game.LoserMarked"
  | "Game.ResultChanged"
  | "Game.Archived";

/**
 * Who played a game: a player of the competition, or in a test, which has no
 * players entered in it, a player of one of its teams.
 */
export type GamePlayerId = CompetitionPlayerId | TeamPlayerId;

/** The player of a game written as `written`, of whichever kind it is written as. */
export const gamePlayerIdFrom = (written: string): GamePlayerId =>
  TeamPlayerId.isWriting(written)
    ? TeamPlayerId.from(written)
    : CompetitionPlayerId.from(written);

/** What a game is, as it is given. */
export interface GameDetails {
  readonly winner: GamePlayerId;
  readonly winnerScore: Score;
  readonly loser: GamePlayerId;
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
 * A game played that is not to count is withdrawn, rather than archived,
 * which is for one entered by mistake. The two are apart, since a withdrawn
 * game can be archived and restored, and is still withdrawn; corrected, it
 * is still withdrawn too.
 *
 * A game is never altered: archiving, restoring, withdrawing, reversing a
 * withdrawal and correcting each give the game as it is afterwards, still
 * added when it was. Two games are the same
 * game when their ids are, since two games between the same players can have
 * the same scores.
 */
export class Game {
  readonly #id: GameId;
  readonly #details: GameDetails;
  readonly #archived: boolean;
  readonly #withdrawn: boolean;
  readonly #addedAt: ReadOnlyDate | undefined;

  private constructor(
    id: GameId,
    details: GameDetails,
    archived: boolean,
    withdrawn: boolean,
    addedAt: ReadOnlyDate | undefined,
  ) {
    this.#id = id;
    this.#details = details;
    this.#archived = archived;
    this.#withdrawn = withdrawn;
    this.#addedAt = addedAt;
  }

  /**
   * The game known by `id` that `details` describe, neither archived nor
   * withdrawn, added at
   * `addedAt` where it was added. Whether drawn games are allowed is the
   * tournament's, so whatever makes the game says. Throws
   * {@link ValidationError} naming the first rule broken.
   */
  static from(
    id: GameId,
    details: GameDetails,
    {
      drawsAllowed,
      addedAt,
    }: { readonly drawsAllowed: boolean; readonly addedAt?: ReadOnlyDate },
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
    return new Game(id, details, false, false, addedAt);
  }

  get id(): GameId {
    return this.#id;
  }

  get winner(): GamePlayerId {
    return this.#details.winner;
  }

  get winnerScore(): Score {
    return this.#details.winnerScore;
  }

  get loser(): GamePlayerId {
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

  get withdrawn(): boolean {
    return this.#withdrawn;
  }

  /**
   * The moment it was added, as the competition recorded it, or nothing for a
   * game that has not been: one made only to ask whether it could be added.
   */
  get addedAt(): ReadOnlyDate | undefined {
    return this.#addedAt;
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
      readonly winner: GamePlayerId;
      readonly loser: GamePlayerId;
    },
  ): Game {
    if (this.#archived) refuse("Game.Archived");
    // A loser put ahead is refused here, as a game the wrong way round.
    const corrected = Game.from(
      this.#id,
      { ...this.#details, ...players, winnerScore, loserScore },
      {
        drawsAllowed,
        ...(this.#addedAt === undefined ? {} : { addedAt: this.#addedAt }),
      },
    );
    if (corrected.drawn !== this.drawn) refuse("Game.ResultChanged");
    return this.#withdrawn ? corrected.withdraw() : corrected;
  }

  /** The game, archived. */
  archive(): Game {
    return this.#archived ? this : this.#with(true, this.#withdrawn);
  }

  /** The game, no longer archived. */
  restore(): Game {
    return this.#archived ? this.#with(false, this.#withdrawn) : this;
  }

  /** The game, withdrawn. */
  withdraw(): Game {
    return this.#withdrawn ? this : this.#with(this.#archived, true);
  }

  /** The game, no longer withdrawn. */
  reverseWithdrawal(): Game {
    return this.#withdrawn ? this.#with(this.#archived, false) : this;
  }

  #with(archived: boolean, withdrawn: boolean): Game {
    return new Game(
      this.#id,
      this.#details,
      archived,
      withdrawn,
      this.#addedAt,
    );
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
