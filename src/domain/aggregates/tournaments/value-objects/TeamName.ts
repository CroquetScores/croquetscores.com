import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a team name can break. */
export type TeamNameErrorCode = "TeamName.Missing" | "TeamName.TooLong";

const MOST_CHARACTERS = 254;

// As few as one, as a competition's name: a team can be called by a letter
// alone as a block can.
const names = new Validator<string, TeamNameErrorCode>({
  fields: [
    {
      field: "name",
      code: "TeamName.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "name",
      code: "TeamName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/** The whole of what a team is called, as it was given, trimmed. */
export class TeamName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The name `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): TeamName {
    // Trimmed before its length is counted, so that the length is the name's
    // and not the spaces typed around it.
    const trimmed = given.trim();
    names.ensureValid(trimmed);
    return new TeamName(trimmed);
  }

  /** How many characters it has, as a reader counts them. */
  get length(): number {
    return charactersIn(this.#given);
  }

  equals(other: TeamName | undefined): boolean {
    return other instanceof TeamName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
