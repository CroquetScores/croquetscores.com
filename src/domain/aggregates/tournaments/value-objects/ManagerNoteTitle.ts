import { charactersIn } from "../../../common/charactersIn.js";
import { Slug } from "../../../common/Slug.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a manager's note's title can break. */
export type ManagerNoteTitleErrorCode =
  | "ManagerNoteTitle.Missing"
  | "ManagerNoteTitle.TooLong"
  | "ManagerNoteTitle.NoLetterOrDigit";

// As a commentary's title, so that a title fits a line of the list on a phone.
const MOST_CHARACTERS = 100;

// Whether a slug can be made of `title`, as making one would make it.
const makesASlug = (title: string): boolean => {
  try {
    Slug.fromName(title);
    return true;
  } catch {
    return false;
  }
};

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
    // A note is found at a slug made from its title, and a title with no
    // letter or digit makes none (Slug.ts). Asked of the slug itself rather
    // than of the title, since a slug takes accents off, as a commentary's
    // title is asked (CommentaryTitle.ts).
    {
      field: "title",
      code: "ManagerNoteTitle.NoLetterOrDigit",
      isBrokenBy: (given) => given !== "" && !makesASlug(given),
    },
  ],
});

/**
 * What a manager's note is called: plain text, kept as it was typed, its
 * HTML and its Markdown, if any, among it; it is shown as the characters it
 * is wherever it is shown. A note is found at a slug made from it, so it has
 * a letter or a digit in it.
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
