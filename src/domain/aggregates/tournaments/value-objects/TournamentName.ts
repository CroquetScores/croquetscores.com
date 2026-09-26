import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a tournament name can break. */
export type TournamentNameErrorCode =
  | "TournamentName.Missing"
  | "TournamentName.TooShort"
  | "TournamentName.TooLong"
  | "TournamentName.AllLowerCase"
  | "TournamentName.AllCapitals";

const FEWEST_CHARACTERS = 3;
const MOST_CHARACTERS = 254;

// A letter has a case when it has a capital and a lower-case form that are not
// the same. Digits, punctuation and the letters of a script with no capitals
// have none, and so say nothing about how the name was typed.
const hasCase = (text: string): boolean =>
  text.toLowerCase() !== text.toUpperCase();

const names = new Validator<string, TournamentNameErrorCode>({
  fields: [
    {
      field: "name",
      code: "TournamentName.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "name",
      code: "TournamentName.TooShort",
      isBrokenBy: (given) =>
        given !== "" && charactersIn(given) < FEWEST_CHARACTERS,
    },
    {
      field: "name",
      code: "TournamentName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
    {
      field: "name",
      code: "TournamentName.AllLowerCase",
      isBrokenBy: (given) => hasCase(given) && given === given.toLowerCase(),
    },
    {
      field: "name",
      code: "TournamentName.AllCapitals",
      isBrokenBy: (given) => hasCase(given) && given === given.toUpperCase(),
    },
  ],
});

/** The name a tournament is known by, as it was given, trimmed. */
export class TournamentName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The name `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): TournamentName {
    // Trimmed before its length is counted, so that the length is the name's
    // and not the spaces typed around it.
    const trimmed = given.trim();
    names.ensureValid(trimmed);
    return new TournamentName(trimmed);
  }

  equals(other: TournamentName | undefined): boolean {
    return other instanceof TournamentName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
