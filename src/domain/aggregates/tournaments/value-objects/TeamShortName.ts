import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a team's short name can break. */
export type TeamShortNameErrorCode =
  "TeamShortName.Missing" | "TeamShortName.TooLong";

// Enough for a country's code or a short word, and two of them either side of
// " v " still fit the section bar on a phone.
const MOST_CHARACTERS = 10;

// Unlike a tournament's name, a short name all in capitals is not refused: it
// is most often a code, and a code is written in capitals.
const shortNames = new Validator<string, TeamShortNameErrorCode>({
  fields: [
    {
      field: "shortName",
      code: "TeamShortName.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "shortName",
      code: "TeamShortName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/**
 * What a team is called where there is room for little more than a word, and
 * what its tests are called by, kept as it was typed, trimmed.
 */
export class TeamShortName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The short name `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): TeamShortName {
    const trimmed = given.trim();
    shortNames.ensureValid(trimmed);
    return new TeamShortName(trimmed);
  }

  /** How many characters it has, as a reader counts them. */
  get length(): number {
    return charactersIn(this.#given);
  }

  equals(other: TeamShortName | undefined): boolean {
    return other instanceof TeamShortName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
