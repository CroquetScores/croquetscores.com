// The next time the page asks for something, answered as the scenario says
// rather than as the site would. Here rather than beside one feature, because
// more than one dialog asks for its list when it opens, and a scenario for each
// says the same thing of the answer.
import type { SpecWorld } from "../../support/world.js";

/** What a request is answered with in place of the site's own answer. */
export interface Answer {
  readonly status: number;
  readonly contentType: string;
  readonly body: string;
}

/** An error of the site's, with no code of its own: a page and not a reply. */
export const aServerError: Answer = {
  status: 500,
  contentType: "text/html",
  body: "Something went wrong.",
};

/** A reply that is well made but has nothing in it that was asked for. */
export const anEmptyReply: Answer = {
  status: 200,
  contentType: "application/json",
  body: "{}",
};

/**
 * Answers the next GET of an address `asks` accepts with `answer`, once only,
 * as a dialog asks when it opens. Nothing else is touched. Where `heldBack` is
 * given, the answer waits for it, so that the scenario can do something
 * between the dialog asking and being answered.
 */
export const answerNextGet = async (
  world: SpecWorld,
  asks: RegExp,
  answer: Answer,
  heldBack?: Promise<void>,
): Promise<void> => {
  await world.browserPage.route(
    (url) => asks.test(url.pathname),
    async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await heldBack;
      await route.fulfill({ ...answer });
    },
    { times: 1 },
  );
};
