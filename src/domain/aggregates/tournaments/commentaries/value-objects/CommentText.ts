import { charactersIn } from "../../../../common/charactersIn.js";
import { Validator } from "../../../../common/validation/Validator.js";

/** Every rule what a comment says can break. */
export type CommentTextErrorCode =
  "CommentText.Missing" | "CommentText.TooLong";

const MOST_CHARACTERS = 10_000;

// A tag begins with a letter, a slash or an exclamation mark straight after
// its "<", so that "< 3 hoops" is the words it is and not the start of one.
const TAG = /<[/!a-zA-Z][^>]*>/g;

/**
 * `typed` with every HTML tag taken out and the words between them kept,
 * taken out again until none is left, so that tags typed inside one another,
 * as "<<b>script>", do not leave a tag behind once the inner one is gone.
 * A commentary's title is plain text and takes its tags out the same way
 * (CommentaryTitle.ts).
 */
export const withoutTags = (typed: string): string => {
  let text = typed;
  for (;;) {
    const stripped = text.replace(TAG, "");
    if (stripped === text) return text;
    text = stripped;
  }
};

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
 * What a comment says, in Markdown, with no HTML in it. The tags are taken
 * out when it is made rather than each time it is read, so what is kept is
 * what is shown.
 */
export class CommentText {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * What `typed` says with its tags taken out and its ends trimmed. Throws
   * {@link ValidationError} naming the first rule that breaks.
   */
  static from(typed: string): CommentText {
    // Tags first and trimming after, so that a comment of nothing but tags and
    // spaces is missing, and the length counted is the words' alone. Only the
    // ends are trimmed: a line break or an indent within it can be Markdown.
    const text = withoutTags(typed).trim();
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
