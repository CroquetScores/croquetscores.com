// Which of Postgres's rules for a language the help in that language is
// searched by: what counts as a word, what is only its ending, and which words
// are too common to be worth finding by.
//
// Each language of the site is named, including those that have none of their
// own, rather than the ones without being left to a default. A language added
// to the site that nobody remembered to put here then has no rules at all, which
// a scenario names, instead of being searched by rules that were never chosen
// for it and found a little worse for no reason anyone can see.

/**
 * What Postgres calls the rules a language is searched by. "simple" is the one
 * that has none: words are cut at what is not a letter and matched as written.
 */
export type HelpSearchRules =
  | "simple"
  | "english"
  | "german"
  | "spanish"
  | "swedish"
  | "norwegian"
  | "portuguese"
  | "greek"
  | "arabic";

// By the tag the site knows each language by. Postgres has no rules for
// Afrikaans, Czech, Latvian or Welsh, so they are searched as written: a reader
// finds a page by typing its word as the page spells it. The rules of some
// other language were not borrowed for them, since an ending stripped by the
// wrong language's idea of one would hide pages as readily as it found them.
//
// Egyptian is searched by the rules of Arabic, the nearest Postgres has; the
// help is written in Arabic script and the endings it strips are Arabic's.
const rules: ReadonlyMap<string, HelpSearchRules> = new Map([
  ["en", "english"],
  ["de", "german"],
  ["es", "spanish"],
  ["sv", "swedish"],
  ["nb", "norwegian"],
  ["pt", "portuguese"],
  ["el", "greek"],
  ["ar-EG", "arabic"],
  ["af", "simple"],
  ["cs", "simple"],
  ["lv", "simple"],
  ["cy", "simple"],
]);

/** The rules the help in the language with `tag` is searched by, if it has any. */
export const helpSearchRulesOf = (tag: string): HelpSearchRules | undefined =>
  rules.get(tag);
