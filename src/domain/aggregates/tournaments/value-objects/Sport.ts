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

  private constructor(code: string, name: string, hasWorldRankings = false) {
    this.#code = code;
    this.#name = name;
    this.#hasWorldRankings = hasWorldRankings;
  }

  static readonly associationCroquet = new Sport(
    "ac",
    "Association Croquet",
    true,
  );
  static readonly golfCroquet = new Sport("gc", "Golf Croquet", true);
  static readonly american6Wicket = new Sport("a6w", "American 6 Wicket");
  static readonly ricochet = new Sport("rc", "Ricochet");
  static readonly gateball = new Sport("gb", "Gateball");

  /**
   * Whether it is ranked across the world, so that its players have a name the
   * world rankings know them by to ask for (Sport.feature).
   */
  get hasWorldRankings(): boolean {
    return this.#hasWorldRankings;
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
