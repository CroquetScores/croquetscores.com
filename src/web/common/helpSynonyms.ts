// The words readers ask with that the help does not use, and what a question is
// made into before it is searched for.
//
// A question is cut into words, each word is put beside the words that mean the
// same in the help, and the lot is searched for as alternatives and ranked by
// how many of them a page has. Alternatives and not all-of: a question is
// written in sentences ("How do I make my tournament visible?") whose small
// words no page has all of, and a search that wanted every one would answer
// almost nothing.
import { afrikaans } from "../languages/help-synonyms/afrikaans.js";
import { czech } from "../languages/help-synonyms/czech.js";
import { egyptian } from "../languages/help-synonyms/egyptian.js";
import { english } from "../languages/help-synonyms/english.js";
import { german } from "../languages/help-synonyms/german.js";
import { greek } from "../languages/help-synonyms/greek.js";
import { latvian } from "../languages/help-synonyms/latvian.js";
import { norwegian } from "../languages/help-synonyms/norwegian.js";
import { portuguese } from "../languages/help-synonyms/portuguese.js";
import { spanish } from "../languages/help-synonyms/spanish.js";
import { swedish } from "../languages/help-synonyms/swedish.js";
import { welsh } from "../languages/help-synonyms/welsh.js";

/**
 * Pairs of words that mean the same here, each written once and read both
 * ways. A pair is not carried further: "live" for "publish" and "visible" for
 * "publish" do not make "live" and "visible" the same, because they are not,
 * and a chain of such steps ends at words that have nothing to do with the
 * first.
 */
export type HelpSynonyms = readonly (readonly [string, string])[];

/** A question as it is searched for. */
export interface ExpandedQuestion {
  /** Every word searched for, what was typed first and then what means the same. */
  readonly words: readonly string[];
  /** The words as Postgres is asked for them, or nothing where there are none. */
  readonly query: string;
}

// Keyed by the tag the site knows each language by, as the rules of a language
// are (helpSearchConfigurations.ts).
const synonyms: ReadonlyMap<string, HelpSynonyms> = new Map([
  ["en", english],
  ["de", german],
  ["es", spanish],
  ["sv", swedish],
  ["nb", norwegian],
  ["pt", portuguese],
  ["el", greek],
  ["ar-EG", egyptian],
  ["af", afrikaans],
  ["cs", czech],
  ["lv", latvian],
  ["cy", welsh],
]);

/** The synonyms kept for the language with `tag`; none at all if it is not one. */
export const helpSynonymsOf = (tag: string): HelpSynonyms | undefined =>
  synonyms.get(tag);

// A word is a run of letters or digits in any script. Everything else, which
// includes every symbol Postgres reads as part of a query, is a gap between
// words and so can never reach the query.
const wordsIn = (question: string): string[] =>
  question.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/** `question` and what in it means the same, ready to be searched for. */
export const expandQuestion = (
  question: string,
  synonyms: HelpSynonyms,
): ExpandedQuestion => {
  const words = new Set<string>();
  for (const typed of wordsIn(question)) {
    words.add(typed);
    for (const [first, second] of synonyms) {
      // Held to the same words a question is, since a synonym is written by
      // hand and one with a hyphen or a quotation mark in it would otherwise
      // reach the query as it stands and break every search in its language.
      if (first === typed) for (const word of wordsIn(second)) words.add(word);
      else if (second === typed)
        for (const word of wordsIn(first)) words.add(word);
    }
  }
  return {
    words: [...words],
    // Each in quotes so that a word is a word whatever it is, and joined by
    // "or" so that a page need have only some of them.
    query: [...words].map((word) => `'${word}'`).join(" | "),
  };
};
