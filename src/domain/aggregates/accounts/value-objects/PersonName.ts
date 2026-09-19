import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a name can break. */
export type PersonNameErrorCode =
  "PersonName.Missing" | "PersonName.TooShort" | "PersonName.TooLong";

const FEWEST_CHARACTERS = 3;
const MOST_CHARACTERS = 254;

// Characters as a reader counts them. A letter with its accent typed after it
// is two code points and one character, and a name is not refused, or let
// through, for how its keyboard spelled it.
const graphemes = new Intl.Segmenter();
const charactersIn = (text: string): number =>
  [...graphemes.segment(text)].length;

// Nothing is asked of a name but its length. People's names are not a shape
// rules can be written for, and every rule written for them turns somebody
// away.
const names = new Validator<string, PersonNameErrorCode>({
  fields: [
    {
      field: "name",
      code: "PersonName.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "name",
      code: "PersonName.TooShort",
      isBrokenBy: (given) =>
        given !== "" && charactersIn(given) < FEWEST_CHARACTERS,
    },
    {
      field: "name",
      code: "PersonName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/** The name an account is known by, as it was given, trimmed. */
export class PersonName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The name `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): PersonName {
    // Trimmed before its length is counted, so that the length is the name's
    // and not the spaces typed around it.
    const trimmed = given.trim();
    names.ensureValid(trimmed);
    return new PersonName(trimmed);
  }

  equals(other: PersonName | undefined): boolean {
    return other instanceof PersonName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
