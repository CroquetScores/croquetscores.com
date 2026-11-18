import { ValidationError } from "../../../../common/validation/ValidationError.js";
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

// How a game keeps one: the percentage, then the hoops over the target, and a
// space and a w where the winner was declared.
const WRITTEN = /^(\d+)% \((\d+)\/(\d+)\)( w)?$/;

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
  readonly #won: boolean;

  private constructor(hoops: number, target: number, won: boolean) {
    this.#hoops = hoops;
    this.#target = target;
    this.#won = won;
  }

  /**
   * The scoring fraction of `hoops` against `target`, the winner's where `won`
   * says it was declared, as a score's mark is (`Score.feature`): a game that
   * leaves both sides on the same fraction is won by whoever is so declared.
   * Throws {@link ValidationError} naming the first rule broken.
   */
  static from(hoops: number, target: number, won = false): ScoringFraction {
    given.ensureValid({ hoops, target });
    return new ScoringFraction(hoops, target, won);
  }

  /**
   * The scoring fraction `written` is, as a game keeps one, or nothing where it
   * is not written so. Only what {@link toString} writes is read: a percentage
   * that is not the one its hoops and target make, or hoops and a target that
   * cannot make a fraction, are no scoring fraction, and are never taken for
   * the nearest (ScoringFraction.feature).
   */
  static read(written: string): ScoringFraction | undefined {
    const found = WRITTEN.exec(written);
    if (found === null) return undefined;
    const [, percentage, hoops, target, mark] = found;
    try {
      const fraction = ScoringFraction.from(
        Number(hoops),
        Number(target),
        mark !== undefined,
      );
      return fraction.percentage === Number(percentage) ? fraction : undefined;
    } catch (refused) {
      if (refused instanceof ValidationError) return undefined;
      throw refused;
    }
  }

  get hoops(): number {
    return this.#hoops;
  }

  get target(): number {
    return this.#target;
  }

  /** Whether it is the winner's, declared as such. */
  get won(): boolean {
    return this.#won;
  }

  /** The percentage, a whole number from 0 to 100. */
  get percentage(): number {
    return Math.floor((200 * this.#hoops + this.#target) / (2 * this.#target));
  }

  equals(other: ScoringFraction | undefined): boolean {
    return (
      other instanceof ScoringFraction &&
      this.#hoops === other.#hoops &&
      this.#target === other.#target &&
      this.#won === other.#won
    );
  }

  /** As a game's score is written: `83% (5/6)`, and `50% (3/6) w` where declared. */
  toString(): string {
    return `${String(this.percentage)}% (${String(this.#hoops)}/${String(this.#target)})${this.#won ? " w" : ""}`;
  }
}
