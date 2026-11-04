// A question put to the help, and the pages that answer it
// (helpSearch.feature).
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { HelpSearchResult } from "../../application/services/HelpSearchIndex.js";
import {
  snippetEnd,
  snippetStart,
} from "../../application/services/HelpSearchIndex.js";
import { Refused } from "../../domain/common/Refused.js";
import { escape } from "./escape.js";
import { helpPath } from "./helpPages.js";
import { helpSearchRulesOf } from "./helpSearchConfigurations.js";
import { ipAddressOf } from "./trustedProxy.js";
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

/**
 * How many questions one address may ask in a minute, by the API or by the
 * form. Sixty is a question a second, far past anything typed; a page showing
 * results as they are typed asks once the typing pauses, not at each key.
 */
export const questionsAMinute = 60;

/** The field a question is typed in, and sent in by the form. */
export const helpSearchField = "question";

/**
 * What was typed in the form and sent: nothing where nothing was, or where it
 * was sent as anything but text. Read here once, for the page that searches
 * and for the limit that counts the searches, so that they cannot disagree
 * about which requests ask a question.
 */
export const questionAsked = (request: FastifyRequest): string => {
  const typed = (request.query as Record<string, unknown>)[helpSearchField];
  return typeof typed === "string" ? typed.trim() : "";
};

/** Where the API answers a question, which the limit counts. */
export const helpSearchApiPath = "/api/site/help/search";

/**
 * Counts the questions an address asks, by the API and by the form together,
 * in one count: two counts would allow twice what is meant. Registered once,
 * for the whole site, and it counts only requests that ask something: opening
 * the help is not asking it, and a reader is never turned away from the help
 * for reading it. Kept in this process, as the site's files are (assets.ts).
 *
 * Not given to the routes one by one: the plugin keeps a count for each route
 * that configures it, so two routes configured alike are counted apart.
 */
export const registerQuestionLimit = async (
  server: FastifyInstance,
): Promise<void> => {
  await server.register(rateLimit, {
    max: questionsAMinute,
    timeWindow: "1 minute",
    keyGenerator: ipAddressOf,
    cache: 100_000,
    allowList: (request) =>
      !(
        (request.method === "POST" &&
          request.routeOptions.url === helpSearchApiPath) ||
        (request.method === "GET" &&
          request.routeOptions.url === helpPath &&
          questionAsked(request) !== "")
      ),
  });
  // The answer that says to wait is for the one who asked, now.
  server.addHook("onSend", (_request, reply, payload, done) => {
    if (reply.statusCode === 429) reply.header("cache-control", "no-store");
    done(null, payload);
  });
};

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
  name === ""
    ? helpPath
    : `${helpPath}/${name.split("/").map(encodeURIComponent).join("/")}`;
