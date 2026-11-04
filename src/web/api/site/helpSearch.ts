// POST /api/site/help/search — a question put to the help, answered with the
// pages most likely to answer it (helpSearch.feature). Open to anybody, as the
// help is: nothing it answers with is not on a page anyone can read.
import rateLimit from "@fastify/rate-limit";
import type { FastifyPluginCallback } from "fastify";

import { SearchHelp } from "../../../application/operations/help/SearchHelp.js";
import {
  answerHelpQuestion,
  HelpSearchRefused,
  questionsAMinute,
} from "../../common/helpSearch.js";
import { speakingOf } from "../../common/language.js";
import { ipAddressOf } from "../../common/trustedProxy.js";

export interface HelpSearchRouteOptions {
  /** Where the help puts a page, which differs for the few with an address of their own. */
  readonly addressOf: (name: string) => string;
  /** How many questions one address may ask in a minute. */
  readonly questionsAMinute?: number;
}

const addressesCounted = 100_000;

export const helpSearchRoute: FastifyPluginCallback<HelpSearchRouteOptions> = (
  server,
  { addressOf, questionsAMinute: limit = questionsAMinute },
  done,
) => {
  // In a scope of its own, so that the count is of questions and a page is
  // never turned away for the ones a reader has asked.
  void server.register(async (scope) => {
    await scope.register(rateLimit, {
      max: limit,
      timeWindow: "1 minute",
      keyGenerator: ipAddressOf,
      cache: addressesCounted,
    });

    scope.post<{ Body: { query?: unknown } | null }>(
      "/help/search",
      async (request, reply) => {
        const speaking = speakingOf(request);
        try {
          const results = await answerHelpQuestion(
            request.body?.query,
            speaking.language.tag,
            request.server.languages[0]?.tag,
            (tag, rules, query) =>
              request.server.mediator.query(new SearchHelp(tag, rules, query)),
            addressOf,
          );
          return reply.header("cache-control", "no-store").send({ results });
        } catch (error) {
          if (!(error instanceof HelpSearchRefused)) throw error;
          return reply
            .code(400)
            .header("cache-control", "no-store")
            .send({ error: error.code });
        }
      },
    );
  });
  done();
};
