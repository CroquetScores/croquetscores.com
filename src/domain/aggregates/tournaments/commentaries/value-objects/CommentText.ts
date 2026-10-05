import { charactersIn } from "../../../../common/charactersIn.js";
import { Validator } from "../../../../common/validation/Validator.js";

/** Every rule what a comment says can break. */
export type CommentTextErrorCode =
  "CommentText.Missing" | "CommentText.TooLong";

const MOST_CHARACTERS = 10_000;

const texts = new Validator<string, CommentTextErrorCode>({
  fields: [
    {
      field: "text",
      code: "CommentText.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "text",
      code: "CommentText.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/**
 * What a comment says, in Markdown, as it was typed, HTML and all. A comment
 * is drawn with HTML turned off (commentary.ts), so HTML typed in it is shown
 * as the characters it is and runs nothing; that is the whole of the guard.
 * Taking its tags out as it was kept, as a browser would tell them, was tried,
 * and was given up: it was more than a comment needs, and the source of fault
 * after fault.
 */
export class CommentText {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * What `typed` says with its ends trimmed. Throws {@link ValidationError}
   * naming the first rule that breaks.
   */
  static from(typed: string): CommentText {
    // Only the ends are trimmed: a line break or an indent within it can be
    // Markdown.
    const text = typed.trim();
    texts.ensureValid(text);
    return new CommentText(text);
  }

  equals(other: CommentText | undefined): boolean {
    return other instanceof CommentText && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
