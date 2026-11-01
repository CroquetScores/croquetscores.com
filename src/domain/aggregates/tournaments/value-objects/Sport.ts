import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a sport can break. */
export type SportErrorCode = "Sport.Missing" | "Sport.Unknown";

const codes = new Validator<string, SportErrorCode>({
  fields: [
    {
      field: "code",
      code: "Sport.Missing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * The sport a tournament is played in: one of five, known by its code and
 * shown by its name.
 *
 * The codes are given rather than worked out from the names, because they are
 * the short forms players already use, and those follow no rule: American 6
 * Wicket is "a6w", and Ricochet is "rc".
 */
export class Sport {
  readonly #code: string;
  readonly #name: string;
  readonly #hasWorldRankings: boolean;
  readonly #countsTowardsWorldRankings: boolean;

  private constructor(
    code: string,
    name: string,
    hasWorldRankings = false,
    countsTowardsWorldRankings = hasWorldRankings,
  ) {
    this.#code = code;
    this.#name = name;
    this.#hasWorldRankings = hasWorldRankings;
    this.#countsTowardsWorldRankings = countsTowardsWorldRankings;
  }

  static readonly associationCroquet = new Sport(
    "ac",
    "Association Croquet",
    true,
  );
  static readonly golfCroquet = new Sport("gc", "Golf Croquet", true);
  // Ranked as golf croquet is, but its players are known to the rankings by
  // their own names, so it has no list of players and its players are never
  // asked for a world ranking name (Sport.feature).
  static readonly american6Wicket = new Sport(
    "a6w",
    "American 6 Wicket",
    false,
    true,
  );
  static readonly ricochet = new Sport("rc", "Ricochet");
  static readonly gateball = new Sport("gb", "Gateball");

  /**
   * Whether it is ranked across the world, so that its players have a name the
   * world rankings know them by to ask for (Sport.feature).
   */
  get hasWorldRankings(): boolean {
    return this.#hasWorldRankings;
  }

  /**
   * Whether a tournament of it may count towards the world rankings, and is
   * sent to them. A sport can be ranked without its players having a name of
   * their own there, as American 6 Wicket is (Sport.feature).
   */
  get countsTowardsWorldRankings(): boolean {
    return this.#countsTowardsWorldRankings;
  }

  /**
   * The most hoops a game of it is played to unless a competition says
   * otherwise: 13 in golf croquet, where a game is the first to win 7 of 13,
   * and 26 in the rest, which are not played to a shorter number as a rule.
   */
  get usualMaximumHoops(): number {
    return this.code === "gc" ? 13 : 26;
  }

  /** Every sport there is. */
  static readonly all: readonly Sport[] = [
    Sport.associationCroquet,
    Sport.golfCroquet,
    Sport.american6Wicket,
    Sport.ricochet,
    Sport.gateball,
  ];

  /**
   * The sport whose code is `code`, exactly as it is written. Throws
   * {@link ValidationError} when there is no code, or no sport with that code.
   */
  static from(code: string): Sport {
    // Not trimmed or lowered, as a flag's name is: a code is read from an
    // address or a record rather than typed, so one written any other way is a
    // mistake in whatever gave it.
    codes.ensureValid(code);
    const sport = Sport.all.find((known) => known.code === code);
    if (sport === undefined)
      throw new ValidationError<SportErrorCode>("Sport.Unknown");
    return sport;
  }

  /** How it is known: the short form players use. */
  get code(): string {
    return this.#code;
  }

  /** What a reader calls it. */
  get name(): string {
    return this.#name;
  }

  /** Two sports are the same when their codes are. */
  equals(other: Sport | undefined): boolean {
    return other instanceof Sport && this.code === other.code;
  }

  toString(): string {
    return this.#name;
  }
}
