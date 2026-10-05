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
// its end or none; or a doctype. An HTML comment is read on its own, since
// it ends at "-->" and not at the first ">".
const WHOLE_TAG = new RegExp(
  String.raw`^<(?:(/?)([A-Za-z0-9]+)((?:\s+${ATTRIBUTE})*)\s*/?|![Dd][Oo][Cc][Tt][Yy][Pp][Ee](?:\s[^>]*)?)>$`,
);

/**
 * The element `written`, from its "<" to its ">", is a tag of, or nothing
 * where it is no tag. A tag is an element's name alone, closing or not, or an
 * opening one with attributes, at least one of them given a value: words in
 * brackets, the first of them an element's name, as "<a great shot>", read as
 * attributes given no value, and a writer means them as words. A doctype is
 * a tag of no element.
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
  // "<!" begins an HTML comment, "<!--", or a doctype, and nothing else does:
  // "<!!! what a shot>" is words. Asked of what has been kept so far, which
  // may be the start of either.
  if (kept[next] === "!") {
    // Up to a "<" kept after it, if one has been, which taken out with the
    // tag it begins would leave this one followed by something else.
    const read = kept.slice(next + 1, next + 9).join("");
    const rest = read.split("<", 1)[0] ?? "";
    if (rest.startsWith("--") || "--".startsWith(rest)) return true;
    const lower = rest.toLowerCase();
    if ("doctype".startsWith(lower)) return true;
    return (
      lower.startsWith("doctype") &&
      (rest.length === 7 ? read.length > 7 : SPACE.test(rest.charAt(7)))
    );
  }
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

// A "<" that could still begin a tag, and how far into its attributes what
// has been kept after it has gone.
interface Opening {
  readonly at: number;
  // How many characters have been read after it, and whether any of them
  // began its name.
  read: number;
  begun: boolean;
  // Whether it is followed by "!", as an HTML comment or a doctype is, which
  // have no attributes and so no values in quotes; how many of the two dashes
  // after it that begin a comment have been read; and whether it begins a
  // comment, "<!--", inside which everything is the comment's until "-->".
  bang: boolean;
  dashes: number;
  comment: boolean;
  // Whether its name has been ended, by a space or a slash, so that what
  // follows is its attributes.
  named: boolean;
  // Whether an "=" has just been read, so that a quote next begins a value.
  afterEquals: boolean;
  // The quote a value is being read inside, which only the same quote ends.
  quote: string | undefined;
  // How far into its attributes the "<" before this one had gone before this
  // one was read after it, to be so again if this one is taken out with the
  // tag it begins, as though it had never been read.
  readonly before: Omit<Opening, "before"> | undefined;
}

// What `character`, kept after the "<" `opening`, makes of how far into its
// attributes it has gone. A quote begins a value only straight after an "=",
// with spaces between or none, as a browser reads it; anywhere else it is a
// character like any other.
const readInto = (opening: Opening, character: string): void => {
  opening.read += 1;
  if (opening.read === 1 && character === "!") opening.bang = true;
  if (opening.bang) {
    if (opening.read === opening.dashes + 2 && character === "-") {
      opening.dashes += 1;
      if (opening.dashes === 2) opening.comment = true;
    }
    return;
  }
  if (opening.quote !== undefined) {
    if (character === opening.quote) opening.quote = undefined;
    return;
  }
  if (!opening.named) {
    // A slash straight after the "<" is a closing tag's, and ends no name.
    if (NAME_CHARACTER.test(character)) opening.begun = true;
    else if (opening.begun && (SPACE.test(character) || character === "/")) {
      opening.named = true;
    }
    return;
  }
  if (opening.afterEquals) {
    if (SPACE.test(character)) return;
    opening.afterEquals = false;
    if (character === '"' || character === "'") {
      opening.quote = character;
      return;
    }
  }
  if (character === "=") opening.afterEquals = true;
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
  // Each "<" that could still begin a tag, the last last, with where it is in
  // what is kept, and how far into its attributes what follows it has gone:
  // whether its name has ended, whether an "=" has just been read, and the
  // quote a value is being read inside, if any. All but the last are waiting
  // on the one after them, and are as they were when it came.
  const opening: Opening[] = [];

  // The last "<" asked again whether it could still begin a tag; one that
  // could not takes every one waiting on it with it.
  const askOfTheLast = (): void => {
    const last = opening.at(-1);
    if (last !== undefined && !couldBegin(kept, last.at)) opening.length = 0;
  };

  // `character` kept, and read as part of what follows the last "<".
  const keep = (character: string): void => {
    kept.push(character);
    const last = opening.at(-1);
    if (last === undefined) return;
    readInto(last, character);
    // A comment begun is one until "-->", whatever is in it, so there is
    // nothing to ask of it.
    if (!last.comment) askOfTheLast();
  };

  // The tag the last "<" begins taken out, of the element `tag`, and the
  // "<" waiting on it as it was before it came.
  const takeOut = (last: Opening, tag: string): void => {
    kept.length = last.at;
    opening.pop();
    const waiting = opening.at(-1);
    if (waiting !== undefined && last.before !== undefined) {
      Object.assign(waiting, last.before);
    }
    // The "<" waiting on the one just taken out is followed by whatever
    // comes next now, a line break first where the tag broke a line.
    if (BREAKING.has(tag)) keep("\n");
    else askOfTheLast();
  };

  for (const character of typed) {
    const last = opening.at(-1);
    // Inside an HTML comment, everything is the comment's until "-->", as a
    // browser reads it, a "<" and a ">" among it.
    if (last?.comment === true) {
      if (character === ">" && kept.at(-1) === "-" && kept.at(-2) === "-") {
        takeOut(last, "!");
      } else {
        keep(character);
      }
      continue;
    }
    // Inside a value given in quotes, a "<" and a ">" are the value's, as a
    // browser reads them, and neither begins nor ends a tag.
    if (last?.quote !== undefined) {
      keep(character);
      continue;
    }
    if (character === ">") {
      const tag =
        last === undefined
          ? undefined
          : tagOf(`${kept.slice(last.at).join("")}>`);
      if (last === undefined || tag === undefined) {
        // A ">" kept, which no tag can run across: no "<" before it can begin
        // one any more.
        kept.push(character);
        opening.length = 0;
        continue;
      }
      takeOut(last, tag);
      continue;
    }
    if (character === "<") {
      // The last "<" kept is now waiting on this one, if it could still begin
      // a tag at all.
      const before = last === undefined ? undefined : { ...last };
      keep(character);
      opening.push({
        before:
          before === undefined
            ? undefined
            : {
                at: before.at,
                read: before.read,
                begun: before.begun,
                bang: before.bang,
                dashes: before.dashes,
                comment: before.comment,
                named: before.named,
                afterEquals: before.afterEquals,
                quote: before.quote,
              },
        at: kept.length - 1,
        read: 0,
        begun: false,
        bang: false,
        dashes: 0,
        comment: false,
        named: false,
        afterEquals: false,
        quote: undefined,
      });
      continue;
    }
    keep(character);
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
