import { canMakeASlug } from "../../../common/canMakeASlug.js";
import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a competition name can break. */
export type CompetitionNameErrorCode =
  | "CompetitionName.Missing"
  | "CompetitionName.TooLong"
  | "CompetitionName.NoLetterOrDigit";

const MOST_CHARACTERS = 254;

// There is no fewest beyond one, as there is for a person's name: a block is
// often called by a letter alone, and "A" is a whole name for one.
const names = new Validator<string, CompetitionNameErrorCode>({
  fields: [
    {
      field: "name",
      code: "CompetitionName.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "name",
      code: "CompetitionName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
    // A competition is found at a slug made from its name, and a name with no
    // letter or digit makes none (Slug.ts), which would otherwise throw from
    // inside the handler instead of being told to the admin beside the name.
    {
      field: "name",
      code: "CompetitionName.NoLetterOrDigit",
      isBrokenBy: (given) => given !== "" && !canMakeASlug(given),
    },
  ],
});

/** The name a competition is known by, as it was given, trimmed. */
export class CompetitionName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The name `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): CompetitionName {
    // Trimmed before its length is counted, so that the length is the name's
    // and not the spaces typed around it.
    const trimmed = given.trim();
    names.ensureValid(trimmed);
    return new CompetitionName(trimmed);
  }

  equals(other: CompetitionName | undefined): boolean {
    return other instanceof CompetitionName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
