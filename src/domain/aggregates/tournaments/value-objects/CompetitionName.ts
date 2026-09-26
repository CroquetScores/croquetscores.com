import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a competition name can break. */
export type CompetitionNameErrorCode =
  "CompetitionName.Missing" | "CompetitionName.TooLong";

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
