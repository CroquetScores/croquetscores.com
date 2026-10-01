import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a test's expected matches can break. */
export type ExpectedMatchesErrorCode =
  "ExpectedMatches.NotWhole" | "ExpectedMatches.TooSmall";

// A whole number the platform holds exactly, as a best-of is.
const counts = new Validator<number, ExpectedMatchesErrorCode>({
  fields: [
    {
      field: "expectedMatches",
      code: "ExpectedMatches.NotWhole",
      isBrokenBy: (given) => !Number.isSafeInteger(given),
    },
    {
      field: "expectedMatches",
      code: "ExpectedMatches.TooSmall",
      isBrokenBy: (given) => given < 1,
    },
  ],
});

/**
 * How many matches a test is expected to have, so that whoever reads its
 * scores can see how far through it is. It is what is expected rather than a
 * limit: a test cut short or with a match replayed is not refused a game for
 * it.
 */
export class ExpectedMatches {
  readonly #count: number;

  private constructor(count: number) {
    this.#count = count;
  }

  /** `given` matches. Throws {@link ValidationError} when it is not a count of any. */
  static from(given: number): ExpectedMatches {
    counts.ensureValid(given);
    return new ExpectedMatches(given);
  }

  get count(): number {
    return this.#count;
  }

  equals(other: ExpectedMatches | undefined): boolean {
    return other instanceof ExpectedMatches && this.#count === other.#count;
  }

  toString(): string {
    return String(this.#count);
  }
}
