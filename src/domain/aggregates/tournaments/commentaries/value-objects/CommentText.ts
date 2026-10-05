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

// HTML's own elements, by their names in lower case, for asking of a name in
// whatever case it was typed.
const ELEMENT_NAMES: ReadonlySet<string> = new Set(ELEMENTS);

// The longest of their names, past which a run of letters is no element's.
const LONGEST_NAME = Math.max(...ELEMENTS.map((name) => name.length));

// The elements that break a line where they are drawn, whose tags are taken
// out for a line break rather than for nothing, so that words either side of
// one are not run together, and paragraphs stay paragraphs in Markdown.
const BREAKING: ReadonlySet<string> = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "dd",
  "details",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "summary",
  "table",
  "td",
  "th",
  "tr",
  "ul",
]);

const NAME_CHARACTER = /[A-Za-z0-9]/;
const SPACE = /\s/;

// An attribute: a name, and a value given it if any, quoted or not.
const ATTRIBUTE =
  String.raw`[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>=` +
  "`" +
  String.raw`]+))?`;

// A whole tag, from its "<" to its ">", with no "<" inside it: an element's
// name, closing or not, with attributes after it or none, and a slash before
// its end or none; or an HTML comment or declaration.
const WHOLE_TAG = new RegExp(
  String.raw`^<(?:(/?)([A-Za-z0-9]+)((?:\s+${ATTRIBUTE})*)\s*/?|![^>]*)>$`,
);

/**
 * The element `written`, from its "<" to its ">", is a tag of, or nothing
 * where it is no tag. A tag is an element's name alone, closing or not, or an
 * opening one with attributes, at least one of them given a value: words in
 * brackets, the first of them an element's name, as "<a great shot>", read as
 * attributes given no value, and a writer means them as words. An HTML
 * comment or declaration is a tag of no element.
 */
const tagOf = (written: string): string | undefined => {
  const found = WHOLE_TAG.exec(written);
  if (found === null) return undefined;
  const [, closing, name, attributes] = found;
  if (name === undefined) return "!";
  if (!ELEMENT_NAMES.has(name.toLowerCase())) return undefined;
  const given = attributes ?? "";
  if (given.trim() !== "" && (closing === "/" || !given.includes("="))) {
    return undefined;
  }
  return name.toLowerCase();
};

// Whether a "<" kept so far could still begin a tag, by what has been kept
// straight after it: an element's name, whole or begun, or "<!", or a "<"
// that, taken out with the tag it begins, would leave this one followed by
// something else. A name ended by anything but a space, a slash, a "<" or
// the end of what is kept begins no tag, nor does one no element has.
const couldBegin = (kept: readonly string[], at: number): boolean => {
  let next = at + 1;
  if (kept[next] === "!") return true;
  if (kept[next] === "/") next += 1;
  let name = "";
  while (next < kept.length && NAME_CHARACTER.test(kept[next] ?? "")) {
    name += kept[next];
    next += 1;
    if (name.length > LONGEST_NAME) return false;
  }
  const after = kept[next];
  if (after === undefined || after === "<") return true;
  return (
    (SPACE.test(after) || after === "/") &&
    ELEMENT_NAMES.has(name.toLowerCase())
  );
};

/**
 * `typed` with every HTML tag taken out and the words between them kept: a
 * tag of an element that breaks a line taken out for a line break, and any
 * other for nothing. A tag is taken out the moment its ">" is read, from what
 * has been kept so far, so that one left by taking out another inside it, as
 * "<<b>script>" leaves "<script>", is taken out as it is left, and what is
 * kept never holds a tag.
 *
 * It is read once, whatever is typed. The tags were taken out again and
 * again until none was left, which took as many readings as tags were typed
 * inside one another, and a comment of a hundred thousand of them took a
 * quarter of a minute, which any account could have kept the site busy with.
 * A tag has no "<" inside it, so only the last "<" kept since the last ">"
 * kept can begin the tag a ">" ends; those before it are kept count of only
 * as waiting on the one after them, each of which begins a tag only if the
 * one after it is taken out. So each character is asked about once when a
 * ">" is read, and either taken out with its tag or kept for good. A
 * commentary's title is plain text and takes its tags out the same way
 * (CommentaryTitle.ts).
 */
export const withoutTags = (typed: string): string => {
  const kept: string[] = [];
  // Where each "<" that could still begin a tag is in what is kept, the last
  // last. All but the last are waiting on the one after them.
  const opening: number[] = [];

  // The last "<" asked again whether it could still begin a tag; one that
  // could not takes every one waiting on it with it.
  const askOfTheLast = (): void => {
    const last = opening.at(-1);
    if (last !== undefined && !couldBegin(kept, last)) opening.length = 0;
  };

  for (const character of typed) {
    if (character === ">") {
      const last = opening.at(-1);
      const tag =
        last === undefined ? undefined : tagOf(`${kept.slice(last).join("")}>`);
      if (last === undefined || tag === undefined) {
        // A ">" kept, which no tag can run across: no "<" before it can begin
        // one any more.
        kept.push(character);
        opening.length = 0;
        continue;
      }
      kept.length = last;
      opening.pop();
      if (BREAKING.has(tag)) kept.push("\n");
      // The "<" waiting on the one just taken out is followed by whatever
      // comes next now.
      askOfTheLast();
      continue;
    }
    if (character === "<") {
      kept.push(character);
      // The last "<" kept is now waiting on this one, if it could still begin
      // a tag at all.
      askOfTheLast();
      opening.push(kept.length - 1);
      continue;
    }
    kept.push(character);
    askOfTheLast();
  }
  return kept.join("");
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
