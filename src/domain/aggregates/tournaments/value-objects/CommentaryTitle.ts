import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a commentary title can break. */
export type CommentaryTitleErrorCode =
  | "CommentaryTitle.Missing"
  | "CommentaryTitle.TooLong"
  | "CommentaryTitle.NoLetterOrDigit";

// As the old site held it, so that a title fits a line of the list on a phone.
const MOST_CHARACTERS = 100;

const titles = new Validator<string, CommentaryTitleErrorCode>({
  fields: [
    {
      field: "title",
      code: "CommentaryTitle.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "title",
      code: "CommentaryTitle.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
    // A commentary is found at a slug made from its title, and a title with no
    // letter or digit makes none (Slug.ts), which would leave the commentary
    // nowhere to be found.
    {
      field: "title",
      code: "CommentaryTitle.NoLetterOrDigit",
      isBrokenBy: (given) => given !== "" && !/[\p{L}\p{N}]/u.test(given),
    },
  ],
});

/**
 * What a commentary is called: plain text, kept as it was typed, its HTML and
 * its Markdown, if any, among it; it is shown as the characters it is
 * wherever it is shown.
 */
export class CommentaryTitle {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * `typed` with its ends trimmed. Throws {@link ValidationError} naming the
   * first rule it breaks.
   */
  static from(typed: string): CommentaryTitle {
    // Trimmed before its length is counted, so that the length is the title's
    // and not the spaces typed around it.
    const title = typed.trim();
    titles.ensureValid(title);
    return new CommentaryTitle(title);
  }

  equals(other: CommentaryTitle | undefined): boolean {
    return other instanceof CommentaryTitle && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
