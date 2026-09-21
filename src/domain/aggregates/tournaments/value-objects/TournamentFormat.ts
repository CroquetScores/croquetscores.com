import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a tournament format can break. */
export type TournamentFormatErrorCode =
  "TournamentFormat.Missing" | "TournamentFormat.Unknown";

const names = new Validator<string, TournamentFormatErrorCode>({
  fields: [
    {
      field: "name",
      code: "TournamentFormat.Missing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * The format a tournament is played in: one of five, known by its name, with a
 * code worked out from the name for whatever is not a reader.
 *
 * There is no making a format of any other name, so the five are the only ones
 * there are, and a name that is none of them is refused rather than taken as
 * the nearest.
 */
export class TournamentFormat {
  readonly #name: string;
  readonly #isTeamFormat: boolean;

  private constructor(name: string, isTeamFormat: boolean) {
    this.#name = name;
    this.#isTeamFormat = isTeamFormat;
  }

  static readonly standard = new TournamentFormat("Standard", false);
  static readonly teams = new TournamentFormat("Teams", true);
  static readonly eireCup = new TournamentFormat("Eire Cup", true);
  static readonly interstateShield = new TournamentFormat(
    "Interstate Shield",
    true,
  );
  static readonly gcWorldTeamChampionship = new TournamentFormat(
    "GC World Team Championship",
    true,
  );

  /** Every format there is. */
  static readonly all: readonly TournamentFormat[] = [
    TournamentFormat.standard,
    TournamentFormat.teams,
    TournamentFormat.eireCup,
    TournamentFormat.interstateShield,
    TournamentFormat.gcWorldTeamChampionship,
  ];

  /**
   * The format named `name`, exactly as it is written. Throws
   * {@link ValidationError} when there is no name, or no format of that name.
   */
  static from(name: string): TournamentFormat {
    // Not trimmed or lowered, as a flag's name is: a format is picked from a
    // list rather than typed, so a name written any other way is a mistake in
    // whatever gave it.
    names.ensureValid(name);
    const format = TournamentFormat.all.find((known) => known.name === name);
    if (format === undefined)
      throw new ValidationError<TournamentFormatErrorCode>(
        "TournamentFormat.Unknown",
      );
    return format;
  }

  /** What a reader calls it. */
  get name(): string {
    return this.#name;
  }

  /**
   * Its name in lower case, a hyphen between the words: what an address or a
   * record of a tournament goes by.
   */
  get code(): string {
    return this.#name.toLowerCase().replaceAll(" ", "-");
  }

  /** Whether it is played by teams, which every format but Standard is. */
  get isTeamFormat(): boolean {
    return this.#isTeamFormat;
  }

  /** Two formats are the same when their names are. */
  equals(other: TournamentFormat | undefined): boolean {
    return other instanceof TournamentFormat && this.name === other.name;
  }

  toString(): string {
    return this.#name;
  }
}
