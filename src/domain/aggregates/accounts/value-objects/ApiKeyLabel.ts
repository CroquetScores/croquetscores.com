import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a key's label can break. */
export type ApiKeyLabelErrorCode =
  "ApiKeyLabel.Missing" | "ApiKeyLabel.TooLong";

const MOST_CHARACTERS = 60;

// Only the length is asked, as of a name: a label is whatever its maker finds
// useful to tell their keys apart by, and a rule about its shape would turn
// somebody away for a reason they cannot see.
const labels = new Validator<string, ApiKeyLabelErrorCode>({
  fields: [
    {
      field: "label",
      code: "ApiKeyLabel.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "label",
      code: "ApiKeyLabel.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/** What a key's maker calls it, such as the app it is for, trimmed. */
export class ApiKeyLabel {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The label `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): ApiKeyLabel {
    const trimmed = given.trim();
    labels.ensureValid(trimmed);
    return new ApiKeyLabel(trimmed);
  }

  toString(): string {
    return this.#given;
  }
}
