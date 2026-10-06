import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a manager's note's title can break. */
export type ManagerNoteTitleErrorCode =
  "ManagerNoteTitle.Missing" | "ManagerNoteTitle.TooLong";

// As a commentary's title, so that a title fits a line of the list on a phone.
const MOST_CHARACTERS = 100;

const titles = new Validator<string, ManagerNoteTitleErrorCode>({
  fields: [
    {
      field: "title",
      code: "ManagerNoteTitle.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "title",
      code: "ManagerNoteTitle.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/**
 * What a manager's note is called: plain text, kept as it was typed, its
 * HTML and its Markdown, if any, among it; it is shown as the characters it
 * is wherever it is shown. Unlike a commentary's title it makes no slug, since
 * a note is found by its id, so it need have no letter or digit in it.
 */
export class ManagerNoteTitle {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * `typed` with its ends trimmed. Throws {@link ValidationError} naming the
   * first rule it breaks.
   */
  static from(typed: string): ManagerNoteTitle {
    // Trimmed before its length is counted, so that the length is the title's
    // and not the spaces typed around it.
    const title = typed.trim();
    titles.ensureValid(title);
    return new ManagerNoteTitle(title);
  }

  equals(other: ManagerNoteTitle | undefined): boolean {
    return other instanceof ManagerNoteTitle && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
