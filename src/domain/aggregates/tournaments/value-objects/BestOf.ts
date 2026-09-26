import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a best-of can break. */
export type BestOfErrorCode = "BestOf.NotWhole" | "BestOf.TooSmall";

// A whole number the platform holds exactly, as an order is, so that the
// number of games kept is the number that was given.
const games = new Validator<number, BestOfErrorCode>({
  fields: [
    {
      field: "games",
      code: "BestOf.NotWhole",
      isBrokenBy: (given) => !Number.isSafeInteger(given),
    },
    {
      field: "games",
      code: "BestOf.TooSmall",
      isBrokenBy: (given) => given < 1,
    },
  ],
});

/**
 * How many games a match is the best of. It may be even: in a block or a
 * Swiss a match shared one each is a result like any other. Whether it has to
 * be odd is for whatever needs a winner of every match to ask.
 */
export class BestOf {
  readonly #games: number;

  private constructor(given: number) {
    this.#games = given;
  }

  /** The best of `given` games. Throws {@link ValidationError} when it is not one. */
  static from(given: number): BestOf {
    games.ensureValid(given);
    return new BestOf(given);
  }

  get games(): number {
    return this.#games;
  }

  get isOdd(): boolean {
    return this.#games % 2 === 1;
  }

  equals(other: BestOf | undefined): boolean {
    return other instanceof BestOf && this.#games === other.#games;
  }

  toString(): string {
    return `best of ${this.#games}`;
  }
}
