import { charactersIn } from "../../../../common/charactersIn.js";
import { Validator } from "../../../../common/validation/Validator.js";

/** Every rule what a comment says can break. */
export type CommentTextErrorCode =
  "CommentText.Missing" | "CommentText.TooLong";

const MOST_CHARACTERS = 10_000;

// HTML's own elements, by their names, the ones a browser draws and those it
// has stopped drawing alike. A tag is one of these, opening or closing, and
// nothing else is: angle brackets around anything else — a link written in
// Markdown as "<https://example.com>", an email address, words in brackets of
// that shape — are kept as the characters they are. Any "<" followed by a
// letter was taken for a tag at first, and took those away for good.
const ELEMENTS = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "portal",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp",
];

// An element's tag, opening or closing, its name ended by a space, a slash or
// the tag's end, so that "<bold>" is not taken for "<b>"; or an HTML comment
// or declaration, which begins "<!". A "<" followed by a space, as "< 3
// hoops", begins neither.
const TAG = new RegExp(
  `<(?:/?(?:${ELEMENTS.join("|")})(?=[\\s/>])[^>]*|![^>]*)>`,
  "gi",
);

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
