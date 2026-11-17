import { Validator } from "../../../../common/validation/Validator.js";

/** Every rule a scoring fraction can break. */
export type ScoringFractionErrorCode =
  | "ScoringFraction.HoopsNotWhole"
  | "ScoringFraction.HoopsNegative"
  | "ScoringFraction.TargetNotWhole"
  | "ScoringFraction.TargetTooSmall"
  | "ScoringFraction.HoopsAboveTarget";

interface Given {
  readonly hoops: number;
  readonly target: number;
}

// Whole numbers the platform holds exactly, so that the hoops and target kept
// are the ones that were given. The order is the order the rules are named in:
// a target is judged before the hoops are compared with it.
const given = new Validator<Given, ScoringFractionErrorCode>({
  fields: [
    {
      field: "hoops",
      code: "ScoringFraction.HoopsNotWhole",
      isBrokenBy: ({ hoops }) => !Number.isSafeInteger(hoops),
    },
    {
      field: "hoops",
      code: "ScoringFraction.HoopsNegative",
      isBrokenBy: ({ hoops }) => hoops < 0,
    },
    {
      field: "target",
      code: "ScoringFraction.TargetNotWhole",
      isBrokenBy: ({ target }) => !Number.isSafeInteger(target),
    },
    {
      field: "target",
      code: "ScoringFraction.TargetTooSmall",
      isBrokenBy: ({ target }) => target < 1,
    },
    {
      field: "hoops",
      code: "ScoringFraction.HoopsAboveTarget",
      isBrokenBy: ({ hoops, target }) => hoops > target,
    },
  ],
});

/**
 * A player's hoops over their target in an Advantage Golf Croquet game, as the
 * whole percentage Croquet England publishes for it.
 *
 * The percentage is rounded to the nearest whole number, and up where it falls
 * exactly halfway. That is not a choice made here: every cell of the three
 * published tables (Standard, Long and Short, for targets 3 to 20) was checked
 * and each is rounded that way, including the eight that are exactly halfway.
 * Working it out the same way means a game is never kept with a percentage
 * that differs from the table's.
 *
 * It is done in whole numbers, since a fraction held as a float could fall
 * just below a half it is exactly on, and be rounded down.
 */
export class ScoringFraction {
  readonly #hoops: number;
  readonly #target: number;

  private constructor(hoops: number, target: number) {
    this.#hoops = hoops;
    this.#target = target;
  }

  /**
   * The scoring fraction of `hoops` against `target`. Throws
   * {@link ValidationError} naming the first rule broken.
   */
  static from(hoops: number, target: number): ScoringFraction {
    given.ensureValid({ hoops, target });
    return new ScoringFraction(hoops, target);
  }

  get hoops(): number {
    return this.#hoops;
  }

  get target(): number {
    return this.#target;
  }

  /** The percentage, a whole number from 0 to 100. */
  get percentage(): number {
    return Math.floor((200 * this.#hoops + this.#target) / (2 * this.#target));
  }

  equals(other: ScoringFraction | undefined): boolean {
    return (
      other instanceof ScoringFraction &&
      this.#hoops === other.#hoops &&
      this.#target === other.#target
    );
  }

  /** As a game's score is written: `83% (5/6)`. */
  toString(): string {
    return `${String(this.percentage)}% (${String(this.#hoops)}/${String(this.#target)})`;
  }
}
