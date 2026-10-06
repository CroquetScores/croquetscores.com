import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a manager's note's description can break. */
export type ManagerNoteDescriptionErrorCode = "ManagerNoteDescription.TooLong";

// Room for a tournament's whole conditions of play, pasted in: the limit is
// there so that a note has an end, not to keep it short.
const MOST_CHARACTERS = 750_000;

const descriptions = new Validator<string, ManagerNoteDescriptionErrorCode>({
  fields: [
    {
      field: "description",
      code: "ManagerNoteDescription.TooLong",
      // Counting characters as a reader counts them takes half a second over
      // a description near the limit, and a description is made again each
      // time its tournament is read. No text holds more characters than its
      // length in code units, so only one longer than the limit is counted.
      isBrokenBy: (given) =>
        given.length > MOST_CHARACTERS && charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/**
 * What a manager's note says beneath its title, in Markdown, as it was typed,
 * HTML and all. A note is drawn with HTML turned off (markdown.ts), so HTML
 * typed in it is shown as the characters it is and runs nothing, as a
 * comment's is (CommentText.ts).
 */
export class ManagerNoteDescription {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * What `typed` says with its ends trimmed, or nothing when that leaves
   * nothing: a description is optional, so there being none is not a mistake.
   * Throws {@link ValidationError} naming the first rule it breaks.
   */
  static from(typed: string): ManagerNoteDescription | undefined {
    // Only the ends are trimmed: a line break or an indent within it can be
    // Markdown.
    const description = typed.trim();
    descriptions.ensureValid(description);
    return description === ""
      ? undefined
      : new ManagerNoteDescription(description);
  }

  equals(other: ManagerNoteDescription | undefined): boolean {
    return (
      other instanceof ManagerNoteDescription && this.#given === other.#given
    );
  }

  toString(): string {
    return this.#given;
  }
}
