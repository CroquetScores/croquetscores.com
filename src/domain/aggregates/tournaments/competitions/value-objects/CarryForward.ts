import { Validator } from "../../../../common/validation/Validator.js";

/** The six counts, in the order they are asked. */
export const CARRY_FORWARD_COUNTS = [
  "matchWins",
  "matchLosses",
  "gameWins",
  "gameLosses",
  "hoopsFor",
  "hoopsAgainst",
] as const;

export type CarryForwardCount = (typeof CARRY_FORWARD_COUNTS)[number];

/** Each count, as it is given, before anything is asked of it: nothing where nothing is carried forward. */
export type CarryForwardCounts = {
  readonly [count in CarryForwardCount]?: number | undefined;
};

/**
 * Every rule a carry forward can break. Each count has codes of its own, so
 * that a form can say the refusal beside the count it is about.
 */
export type CarryForwardErrorCode =
  | `CarryForward.${Capitalize<CarryForwardCount>}NotWhole`
  | `CarryForward.${Capitalize<CarryForwardCount>}BelowZero`;

const capitalised = (count: CarryForwardCount): Capitalize<CarryForwardCount> =>
  (count.charAt(0).toUpperCase() +
    count.slice(1)) as Capitalize<CarryForwardCount>;

// A whole number the platform holds exactly, as an order is. A count left out
// breaks neither rule, since it is nothing carried forward rather than a
// number. Asked a count at a time, in the order the counts are named, so the
// first count broken is the one refused.
const counts = new Validator<CarryForwardCounts, CarryForwardErrorCode>({
  fields: CARRY_FORWARD_COUNTS.flatMap((count) => [
    {
      field: count,
      code: `CarryForward.${capitalised(count)}NotWhole` as const,
      isBrokenBy: (given: CarryForwardCounts) => {
        const value = given[count];
        return value !== undefined && !Number.isSafeInteger(value);
      },
    },
    {
      field: count,
      code: `CarryForward.${capitalised(count)}BelowZero` as const,
      isBrokenBy: (given: CarryForwardCounts) => {
        const value = given[count];
        return value !== undefined && value < 0;
      },
    },
  ]),
});

/**
 * What a player brings into a competition from play it did not score: the
 * matches, games and hoops won and lost. Each count is optional, and one left
 * out is kept as nothing rather than as 0, so that whoever changes it later
 * sees it as it was left.
 */
export class CarryForward {
  readonly #counts: CarryForwardCounts;

  private constructor(given: CarryForwardCounts) {
    // Only the six, so that nothing else given is kept, or compared.
    this.#counts = Object.fromEntries(
      CARRY_FORWARD_COUNTS.map((count) => [count, given[count]]),
    );
  }

  /**
   * The carry forward of `given`. Throws {@link ValidationError} naming the
   * first count broken.
   */
  static from(given: CarryForwardCounts): CarryForward {
    counts.ensureValid(given);
    return new CarryForward(given);
  }

  /** Nothing carried forward in any count. */
  static none(): CarryForward {
    return new CarryForward({});
  }

  /** Every count, nothing where nothing is carried forward. */
  get counts(): CarryForwardCounts {
    return this.#counts;
  }

  /** The count `count`, or nothing where nothing is carried forward in it. */
  of(count: CarryForwardCount): number | undefined {
    return this.#counts[count];
  }

  /** Whether any count is carried forward, a count of 0 among them. */
  get carriesAnything(): boolean {
    return CARRY_FORWARD_COUNTS.some(
      (count) => this.#counts[count] !== undefined,
    );
  }

  /** The same when every count is, a count of 0 and one left out being different. */
  equals(other: CarryForward | undefined): boolean {
    return (
      other instanceof CarryForward &&
      CARRY_FORWARD_COUNTS.every(
        (count) => this.#counts[count] === other.#counts[count],
      )
    );
  }
}
