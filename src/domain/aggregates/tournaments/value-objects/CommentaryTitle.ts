import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";
import { withoutTags } from "../commentaries/value-objects/CommentText.js";

/** Every rule a commentary title can break. */
export type CommentaryTitleErrorCode =
  "CommentaryTitle.Missing" | "CommentaryTitle.TooLong";

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
  ],
});

/**
 * What a commentary is called: plain text, with no HTML in it and its
 * Markdown, if any, kept as the characters it is.
 */
export class CommentaryTitle {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * `typed` with its tags taken out and its ends trimmed. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(typed: string): CommentaryTitle {
    // As a comment is: tags first, then the ends, so that a title of nothing
    // but tags is missing and the length counted is the words' alone.
    const title = withoutTags(typed).trim();
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
