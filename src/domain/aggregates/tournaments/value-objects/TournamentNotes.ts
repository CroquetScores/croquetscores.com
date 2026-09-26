import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule notes can break. */
export type TournamentNotesErrorCode = "TournamentNotes.TooLong";

const MOST_CHARACTERS = 2000;

const notes = new Validator<string, TournamentNotesErrorCode>({
  fields: [
    {
      field: "notes",
      code: "TournamentNotes.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

// A comment, or a declaration such as <!DOCTYPE html>, taken out whole. One
// left open takes everything after it, since a browser would hide all of that.
// A browser also ends a comment at "--!>", and ends "<!-->" and "<!--->" where
// they stand, so those end one here too rather than hiding the text after them.
const comments = /<!--(?:-?>|[\s\S]*?(?:--!?>|$))/g;
const declarations = /<[!?][^>]*(?:>|$)/g;

// A script or a style taken out with what it holds, and one left open with
// everything after it, for the same reason. Taken out before the tags, so that
// its opening tag is still there to find.
const scriptsAndStyles = /<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi;

// Markdown's own ways of writing a link between angle brackets, as CommonMark
// defines them: a scheme and a colon with no whitespace or angle bracket after
// it, or an email address. Either one with anything else before its ">" is not
// one of these, and is a tag like any other.
const link = "[a-z][a-z0-9+.-]{1,31}:[^\\s<>]*";
const emailAddress =
  "[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?" +
  "(?:\\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*";

// A tag begins where a browser takes one to begin, at a "<" or "</" followed by
// a letter, whatever the rest of its name holds: "<x!y onmouseover=...>" is a
// tag to a browser, and its attributes count. Only the links above are not. A
// "<" followed by anything else begins no tag, and is text. A tag left open
// takes everything after it: Markdown passes "<div onmouseover=..." at the
// start of a line through as it stands, and a browser would then read the
// page after the notes as the rest of the tag, so its attributes would count.
const tags = new RegExp(
  `<(?!(?:${link}|${emailAddress})>)\\/?[a-z][^>]*(?:>|$)`,
  "gi",
);

// A browser reads a letter of a scheme however it is written: in either case,
// or as a character reference, decimal or hexadecimal, with or without its
// semicolon. So each letter is looked for in every one of those spellings.
const spellingsOf = (character: string): string => {
  const codes = [character.toLowerCase(), character.toUpperCase()].map((c) =>
    c.charCodeAt(0),
  );
  const decimal = codes.map(String).join("|");
  const hexadecimal = codes.map((code) => code.toString(16)).join("|");
  return `(?:${character}|&#0*(?:${decimal});?|&#x0*(?:${hexadecimal});?)`;
};

// A browser skips tabs and line breaks between the letters of a scheme, and the
// notes promise to take out one with any whitespace between its letters, so
// whitespace is allowed there however it is written.
const between = "(?:\\s|&Tab;|&NewLine;|&#0*(?:9|10|13);?|&#x0*(?:9|a|d);?)*";
// Markdown lets any punctuation be escaped with a backslash, and drops the
// backslash from a link, so "javascript\:" is still a link to a script.
const colon = "(?:\\\\?:|&colon;|&#0*58;?|&#x0*3a;?)";

const schemeNamed = (name: string): string =>
  [...name].map(spellingsOf).join(between) + between + colon;

// "javascript:" and "vbscript:", wherever they are written, since a link to
// either runs a script when it is followed.
const scripts = new RegExp(
  `${schemeNamed("javascript")}|${schemeNamed("vbscript")}`,
  "gi",
);

const withoutHtmlOrScripts = (text: string): string => {
  // Taking out one piece can bring two halves of another together, as
  // "<<b></b>script>" and "java<b></b>script:" do, so this goes on until a
  // pass takes out nothing.
  let before: string;
  let after = text;
  do {
    before = after;
    after = before
      .replace(comments, "")
      .replace(declarations, "")
      .replace(scriptsAndStyles, "")
      .replace(tags, "")
      .replace(scripts, "");
  } while (after !== before);
  return after;
};

/**
 * The notes a tournament has: Markdown, kept as it was written, with every
 * piece of HTML and every "javascript:" and "vbscript:" taken out.
 *
 * The HTML is taken out when the notes are made rather than when they are
 * shown, so that no page can forget to, and nothing kept is ever something a
 * page must not show.
 */
export class TournamentNotes {
  readonly #markdown: string;

  private constructor(markdown: string) {
    this.#markdown = markdown;
  }

  /**
   * The notes `text` makes once its HTML, its scripts and the whitespace at
   * either end are taken out, or nothing when that leaves nothing: notes are
   * optional, so there being none is not a mistake. Throws
   * {@link ValidationError} naming the first rule `text` breaks.
   */
  static from(text: string): TournamentNotes | undefined {
    // Measured before anything is taken out, so that notes too long are
    // refused without first paying for cleaning them up.
    const trimmed = text.trim();
    notes.ensureValid(trimmed);
    const markdown = withoutHtmlOrScripts(trimmed).trim();
    return markdown === "" ? undefined : new TournamentNotes(markdown);
  }

  /** The notes, in Markdown. */
  get markdown(): string {
    return this.#markdown;
  }

  toString(): string {
    return this.#markdown;
  }
}
