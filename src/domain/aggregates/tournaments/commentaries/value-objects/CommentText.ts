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

// What a "<" kept so far begins, by what has been kept after it: a tag, by
// its name, as soon as the name is ended by a space or a slash, or an HTML
// comment or declaration as soon as it is "<!"; maybe a tag, its name not yet
// ended; waiting on the "<" kept straight after it, which, taken out with the
// tag it begins, would leave this one followed by something else; or no tag.
type Begins =
  | { readonly is: "tag"; readonly name: string }
  | { readonly is: "maybe"; readonly name: string }
  | { readonly is: "waiting" }
  | { readonly is: "nothing" };

const begunAt = (kept: readonly string[], at: number): Begins => {
  let next = at + 1;
  if (kept[next] === "!") return { is: "tag", name: "!" };
  if (kept[next] === "/") next += 1;
  let name = "";
  while (next < kept.length && NAME_CHARACTER.test(kept[next] ?? "")) {
    name += kept[next];
    next += 1;
    if (name.length > LONGEST_NAME) return { is: "nothing" };
  }
  const after = kept[next];
  if (after === undefined) return { is: "maybe", name };
  if (after === "<") return { is: "waiting" };
  if (SPACE.test(after) || after === "/") {
    return ELEMENT_NAMES.has(name.toLowerCase())
      ? { is: "tag", name }
      : { is: "nothing" };
  }
  return { is: "nothing" };
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
 * So only the "<"s that could still begin a tag are kept count of: the last
 * one kept since the last ">" kept, and, below it, those waiting on the one
 * after them, each of which begins a tag only if the one after it is taken
 * out. A commentary's title is plain text and takes its tags out the same way
 * (CommentaryTitle.ts).
 */
export const withoutTags = (typed: string): string => {
  const kept: string[] = [];
  // Where each "<" that could still begin a tag is in what is kept, the last
  // last. All but the last are waiting on the one after them.
  const opening: number[] = [];
  // Where the first "<" kept since the last ">" kept that begins a tag is, if
  // one does: the next ">" ends its tag, whatever comes between.
  let tagAt: number | undefined;

  // What the last "<" begins now, the one below it waiting on it; one that
  // begins no tag takes every one waiting on it with it.
  const askOfTheLast = (): void => {
    const last = opening.at(-1);
    if (last === undefined || tagAt !== undefined) return;
    const begins = begunAt(kept, last);
    if (begins.is === "tag") tagAt = last;
    else if (begins.is === "nothing") opening.length = 0;
  };

  for (const character of typed) {
    if (character === ">") {
      let at = tagAt;
      if (at === undefined) {
        const last = opening.at(-1);
        const begins = last === undefined ? undefined : begunAt(kept, last);
        if (
          last !== undefined &&
          begins?.is === "maybe" &&
          ELEMENT_NAMES.has(begins.name.toLowerCase())
        ) {
          at = last;
        }
      }
      if (at === undefined) {
        // A ">" kept, which no tag can run across: no "<" before it can begin
        // one any more.
        kept.push(character);
        opening.length = 0;
        continue;
      }
      const begins = begunAt([...kept.slice(at), " "], 0);
      kept.length = at;
      tagAt = undefined;
      while ((opening.at(-1) ?? -1) >= at) opening.pop();
      if (begins.is === "tag" && BREAKING.has(begins.name.toLowerCase())) {
        kept.push("\n");
      }
      // The "<" waiting on the one just taken out is followed by whatever
      // comes next now.
      askOfTheLast();
      continue;
    }
    if (tagAt !== undefined) {
      // Inside a tag already begun, which its ">" will take out whole.
      kept.push(character);
      continue;
    }
    if (character === "<") {
      kept.push(character);
      const last = opening.at(-1);
      // The last "<" kept is now waiting on this one, or begins nothing
      // whatever this one turns out to begin.
      if (last !== undefined && begunAt(kept, last).is !== "waiting") {
        opening.length = 0;
      }
      opening.push(kept.length - 1);
      askOfTheLast();
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
