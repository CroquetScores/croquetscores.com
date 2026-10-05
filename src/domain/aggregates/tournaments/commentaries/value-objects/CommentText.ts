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

// An attribute: a name, and a value given it if any, quoted or not. A value
// in quotes may hold a ">", as a browser reads it, but no "<": a tag has none.
const ATTRIBUTE =
  String.raw`[^\s"'<>/=]+(?:\s*=\s*(?:"[^"<]*"|'[^'<]*'|[^\s"'<>=` +
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
  // have no attributes; and how many of the two dashes after it that begin a
  // comment, "<!--", have been read.
  bang: boolean;
  dashes: number;
  // Whether its name has been ended, by a space or a slash, so that what
  // follows is its attributes.
  named: boolean;
  // Whether an "=" has just been read, so that a quote next begins a value.
  afterEquals: boolean;
  // Where, in what was typed, the quote ending the value being read is, if a
  // value is being read.
  quoteEnd: number | undefined;
  // How far the "<" before this one had gone before this one was read after
  // it, to be so again if this one is taken out with the tag it begins, as
  // though it had never been read.
  readonly before: Omit<Opening, "before"> | undefined;
}

// Whether `opening` begins an HTML comment, "<!--", which ends at the first
// "-->" after it, whatever is between.
const isComment = (opening: Opening): boolean =>
  opening.bang && opening.dashes === 2;

/**
 * `typed` with every HTML tag taken out and the words between them kept: a
 * tag of an element that breaks a line taken out for a line break, and any
 * other for nothing. A tag is taken out the moment its ">" is read, from what
 * has been kept so far, so that one left by taking out another inside it, as
 * "<<b>script>" leaves "<script>", is taken out as it is left, and what is
 * kept never holds a tag.
 *
 * Inside an HTML comment, and inside a value given in quotes, tags are taken
 * out as anywhere, and a ">" that ends none is the comment's or the value's
 * rather than an end to the "<" they began after: a comment ends at the first
 * "-->" in what is kept, which taking a tag out may make, and a value at the
 * quote that ends it. Nothing is hidden from being read for tags, so a
 * comment or a quote never ended leaves no tag after it unread.
 *
 * It is read once, whatever is typed. The tags were taken out again and
 * again until none was left, which took as many readings as tags were typed
 * inside one another, and a comment of a hundred thousand of them took a
 * quarter of a minute, which any account could have kept the site busy with.
 * A tag has no "<" inside it, so only the last "<" kept can begin the tag a
 * ">" ends; those before it are kept count of only while they could still
 * begin one, as waiting on the one after them or as a comment or a value
 * begun. A commentary's title is plain text and takes its tags out the same
 * way (CommentaryTitle.ts).
 */
export const withoutTags = (typed: string): string => {
  const characters = Array.from(typed);
  const count = characters.length;
  // For each place in what was typed, where the next double or single quote
  // at or after it is, or nowhere; found in one reading from the end, so that
  // asking where a value ends costs nothing however often it is asked.
  const nextOf = (quote: string): Int32Array => {
    const next = new Int32Array(count + 1).fill(count);
    for (let at = count - 1; at >= 0; at -= 1) {
      next[at] = characters[at] === quote ? at : (next[at + 1] ?? count);
    }
    return next;
  };
  const nextDouble = nextOf('"');
  const nextSingle = nextOf("'");

  const kept: string[] = [];
  // Each "<" that could still begin a tag, the last last.
  const opening: Opening[] = [];
  // Where in `opening` each "<" beginning a comment is, the first first: the
  // first is where a "-->" ends one, since everything after it is its.
  const comments: number[] = [];
  // Where in what was typed the character being read is.
  let reading = 0;

  // Whether `each` is held on to though what follows it has turned out to
  // begin no tag: a comment, which nothing but "-->" ends, or a value in
  // quotes not yet ended, which a ">" does not end either.
  const holds = (each: Opening): boolean =>
    isComment(each) || each.quoteEnd !== undefined;

  // A value whose quote has been read by now is ended, whichever "<" read it.
  const settle = (): void => {
    const last = opening.at(-1);
    if (last?.quoteEnd !== undefined && last.quoteEnd <= reading) {
      last.quoteEnd = undefined;
    }
  };

  // Every "<" since the last one held on to let go of, as beginning no tag.
  const letGo = (): void => {
    while (opening.length > 0 && !holds(opening.at(-1) as Opening)) {
      opening.pop();
    }
    while ((comments.at(-1) ?? -1) >= opening.length) comments.pop();
    settle();
  };

  // What `character`, kept after the last "<", makes of how far into its
  // attributes it has gone. A quote begins a value only straight after an
  // "=", with spaces between or none, and where the same quote comes later in
  // what was typed to end it, as a browser reads it.
  const readIntoTheLast = (character: string): void => {
    const last = opening.at(-1);
    if (last === undefined) return;
    last.read += 1;
    if (last.read === 1 && character === "!") last.bang = true;
    if (last.bang) {
      if (last.read === last.dashes + 2 && character === "-") {
        last.dashes += 1;
        if (isComment(last)) comments.push(opening.length - 1);
      }
      return;
    }
    if (last.quoteEnd !== undefined) {
      if (reading >= last.quoteEnd) last.quoteEnd = undefined;
      return;
    }
    if (!last.named) {
      // A slash straight after the "<" is a closing tag's, and ends no name.
      if (NAME_CHARACTER.test(character)) last.begun = true;
      else if (last.begun && (SPACE.test(character) || character === "/")) {
        last.named = true;
      }
      return;
    }
    if (last.afterEquals) {
      if (SPACE.test(character)) return;
      last.afterEquals = false;
      if (character === '"' || character === "'") {
        const ends = (character === '"' ? nextDouble : nextSingle)[reading + 1];
        if (ends !== undefined && ends < count) last.quoteEnd = ends;
        return;
      }
    }
    if (character === "=") last.afterEquals = true;
  };

  // `character` kept, and read as part of what follows the last "<", which
  // is let go of if it can no longer begin a tag.
  const keep = (character: string): void => {
    kept.push(character);
    readIntoTheLast(character);
    const last = opening.at(-1);
    if (last !== undefined && !holds(last) && !couldBegin(kept, last.at)) {
      letGo();
    }
  };

  // What the "<" at `index` of `opening` begins taken out, a tag of the
  // element `tag`, and the "<" waiting on it as it was before it came.
  const takeOut = (index: number, tag: string): void => {
    const taken = opening[index] as Opening;
    kept.length = taken.at;
    opening.length = index;
    while ((comments.at(-1) ?? -1) >= opening.length) comments.pop();
    const waiting = opening.at(-1);
    if (waiting !== undefined && taken.before !== undefined) {
      Object.assign(waiting, taken.before);
    }
    settle();
    // The "<" waiting on the one just taken out is followed by whatever
    // comes next now, a line break first where the tag broke a line.
    if (BREAKING.has(tag)) {
      keep("\n");
    } else {
      const last = opening.at(-1);
      if (last !== undefined && !holds(last) && !couldBegin(kept, last.at)) {
        letGo();
      }
    }
  };

  for (; reading < count; reading += 1) {
    const character = characters[reading] ?? "";
    if (character === ">") {
      // The end of the first comment begun, where what is kept ends "--".
      const first = comments[0];
      if (
        first !== undefined &&
        kept.at(-1) === "-" &&
        kept.at(-2) === "-" &&
        kept.length - (opening[first] as Opening).at >= 4
      ) {
        takeOut(first, "!");
        continue;
      }
      const last = opening.at(-1);
      const tag =
        last === undefined || holds(last)
          ? undefined
          : tagOf(`${kept.slice(last.at).join("")}>`);
      if (last !== undefined && tag !== undefined) {
        takeOut(opening.length - 1, tag);
        continue;
      }
      // A ">" that ends no tag: the comment's or the value's, where one has
      // been begun, and otherwise an end to every "<" before it.
      kept.push(character);
      letGo();
      continue;
    }
    if (character === "<") {
      // The last "<" kept is now waiting on this one, if it could still begin
      // a tag at all.
      const last = opening.at(-1);
      const before =
        last === undefined
          ? undefined
          : {
              at: last.at,
              read: last.read,
              begun: last.begun,
              bang: last.bang,
              dashes: last.dashes,
              named: last.named,
              afterEquals: last.afterEquals,
              quoteEnd: last.quoteEnd,
            };
      keep(character);
      opening.push({
        before,
        at: kept.length - 1,
        read: 0,
        begun: false,
        bang: false,
        dashes: 0,
        named: false,
        afterEquals: false,
        quoteEnd: undefined,
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
