import type { Site, Website } from "../../../../common/Website.js";
import { ValidationError } from "../../../../common/validation/ValidationError.js";

/** Every rule a score can break. */
export type ScoreErrorCode = "Score.NoPoints";

// What follows a score's number to say its player won, on each site: each
// sport writes its own.
const MARKS: Readonly<Record<Site, readonly string[]>> = {
  croquetScores: ["w", "won", "winner"],
  gateballScores: ["w", "won", "winner", "cb", "so"],
};

// The digits a score begins with, and whatever follows them.
const WRITTEN = /^(\d+)(.*)$/s;

/**
 * A player's score in a game, as the scorer wrote it down: its number of
 * points, which is the digits it begins with, and whatever follows them, as
 * "26tp". What follows means nothing to the site but is the scorer's, so it
 * is kept, and the score is written exactly as it was typed. Where what
 * follows is one of the website's marks and nothing else, the score is marked
 * as the winner's, as "6w", which is how a game won on equal points says who
 * won it.
 */
export class Score {
  readonly #points: number;
  readonly #written: string;
  readonly #marked: boolean;

  private constructor(points: number, written: string, marked: boolean) {
    this.#points = points;
    this.#written = written;
    this.#marked = marked;
  }

  /**
   * The score `typed` says, read with `website`'s marks, without the
   * whitespace at either end. Throws {@link ValidationError} as
   * `Score.NoPoints` where it does not begin with a digit.
   */
  static read(typed: string, website: Website): Score {
    const written = typed.trim();
    const [, digits, rest] = WRITTEN.exec(written) ?? [];
    if (digits === undefined || rest === undefined) {
      throw new ValidationError<ScoreErrorCode>("Score.NoPoints");
    }
    const ending = rest.trim().toLowerCase();
    return new Score(
      Number(digits),
      written,
      MARKS[website.site].includes(ending),
    );
  }

  /**
   * The score as a game kept it: written as it was typed, and whether it was
   * marked when it was, which the website decided then.
   */
  static kept(written: string, marked: boolean): Score {
    const [, digits] = WRITTEN.exec(written) ?? [];
    if (digits === undefined) {
      throw new ValidationError<ScoreErrorCode>("Score.NoPoints");
    }
    return new Score(Number(digits), written, marked);
  }

  get points(): number {
    return this.#points;
  }

  /** Whether it is marked as the winner's. */
  get marked(): boolean {
    return this.#marked;
  }

  isMoreThan(other: Score): boolean {
    return this.#points > other.#points;
  }

  toString(): string {
    return this.#written;
  }
}
