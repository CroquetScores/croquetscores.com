import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a number of rounds can break. */
export type RoundsErrorCode = "Rounds.NotWhole" | "Rounds.TooSmall";

// A whole number the platform holds exactly, as a best-of is, so that the
// number kept is the number that was given.
const rounds = new Validator<number, RoundsErrorCode>({
  fields: [
    {
      field: "rounds",
      code: "Rounds.NotWhole",
      isBrokenBy: (given) => !Number.isSafeInteger(given),
    },
    {
      field: "rounds",
      code: "Rounds.TooSmall",
      isBrokenBy: (given) => given < 1,
    },
  ],
});

/**
 * How many rounds a block is played in: how many matches of its best-of each
 * pair of its players play. Every block says; a block played once is a block
 * played in 1.
 */
export class Rounds {
  readonly #count: number;

  private constructor(given: number) {
    this.#count = given;
  }

  /** `given` rounds. Throws {@link ValidationError} when it is not a number of them. */
  static from(given: number): Rounds {
    rounds.ensureValid(given);
    return new Rounds(given);
  }

  get count(): number {
    return this.#count;
  }

  equals(other: Rounds | undefined): boolean {
    return other instanceof Rounds && this.#count === other.#count;
  }

  toString(): string {
    return `${this.#count} ${this.#count === 1 ? "round" : "rounds"}`;
  }
}
