// A question put to the help, and the pages that answer it
// (helpSearch.feature).
import type { HelpSearchResult } from "../../application/services/HelpSearchIndex.js";
import {
  snippetEnd,
  snippetStart,
} from "../../application/services/HelpSearchIndex.js";
import { Refused } from "../../domain/common/Refused.js";
import { escape } from "./escape.js";
import { helpPath } from "./helpPages.js";
import { helpSearchRulesOf } from "./helpSearchConfigurations.js";
import { expandQuestion, helpSynonymsOf } from "./helpSynonyms.js";

export type HelpSearchErrorCode =
  "HelpSearch.QuestionMissing" | "HelpSearch.QuestionTooLong";

export class HelpSearchRefused extends Refused<HelpSearchErrorCode> {}

/**
 * The longest a question may be, in characters a reader sees. A question is a
 * sentence; one longer is a page pasted in, and is one the index would be
 * asked to look every word of up.
 */
export const longestQuestion = 200;

/** A page that answers a question, as it is shown. */
export interface HelpAnswer {
  readonly title: string;
  readonly url: string;
  /**
   * Safe to put in a page as it is: the words are escaped and the ones that
   * matched are in <mark>. Done here and not by whoever shows it, which would
   * have to escape the text and only then put the marks back.
   */
  readonly snippet: string;
  readonly score: number;
}

export type SearchTheHelp = (
  tag: string,
  rules: string,
  query: string,
) => Promise<readonly HelpSearchResult[]>;

const marked = (snippet: string): string =>
  escape(snippet)
    .split(snippetStart)
    .join("<mark>")
    .split(snippetEnd)
    .join("</mark>");

const searchedIn = async (
  tag: string,
  question: string,
  search: SearchTheHelp,
): Promise<readonly HelpSearchResult[]> => {
  const rules = helpSearchRulesOf(tag);
  if (rules === undefined) return [];
  const { query } = expandQuestion(question, helpSynonymsOf(tag) ?? []);
  return search(tag, rules, query);
};

/**
 * The pages of the help that answer `question`, best first, from the language
 * with `tag`, and from `fallbackTag` where that has none: a reader asking for
 * help has little use for an answer that says there is none, which is how
 * the pages themselves are shown. `addressOf` is where the help puts a page.
 */
export const answerHelpQuestion = async (
  asked: unknown,
  tag: string,
  fallbackTag: string | undefined,
  search: SearchTheHelp,
  addressOf: (name: string) => string,
): Promise<readonly HelpAnswer[]> => {
  const question = typeof asked === "string" ? asked.trim() : "";
  if (question === "") {
    throw new HelpSearchRefused(
      "HelpSearch.QuestionMissing",
      "There is no question to answer.",
    );
  }
  if ([...question].length > longestQuestion) {
    throw new HelpSearchRefused(
      "HelpSearch.QuestionTooLong",
      "The question is too long to be one.",
    );
  }
  let found = await searchedIn(tag, question, search);
  if (found.length === 0 && fallbackTag !== undefined && fallbackTag !== tag) {
    found = await searchedIn(fallbackTag, question, search);
  }
  return found.map((result) => ({
    title: result.title,
    url: addressOf(result.name),
    snippet: marked(result.snippet),
    score: result.score,
  }));
};

/** Where the help puts the page called `name`, which has no address of its own. */
export const helpAddress = (name: string): string =>
  name === "" ? helpPath : `${helpPath}/${name}`;
