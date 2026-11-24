// GET /api/v1/tournaments/sports: the sports the site offers, for apps
// (sports.feature). It follows the list's conventions (tournaments.ts): a key
// that was sent and does not work is refused and having none is not, and an
// answer carries a mark so that one the app has is answered not modified.
import type { FastifyPluginAsync } from "fastify";

import { sportsOffered } from "../../../domain/aggregates/tournaments/value-objects/sports.js";
import { languageNamed, speakingIn } from "../../common/language.js";
import { websiteOf } from "../../common/site.js";
import { refuseKey } from "./apiKey.js";
import { sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { callerOf } from "./rateLimit.js";

interface Asked {
  // An array where the address says it more than once, which the type of a
  // query would otherwise hide.
  readonly language?: string | readonly string[];
}

export const sportsOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: Asked }>(
    "/tournaments/sports",
    (request, reply) => {
      const caller = callerOf(request);
      if (caller.carriedKey && caller.key === undefined) {
        return refuseKey(reply, true);
      }

      // Named in the language asked for with `language`, and in English where
      // none is, found by its tag and not by being first, so that reordering
      // the languages does not change what an app that asks for none is told.
      // Not the language the browser asks for, which an
      // app's request carries by accident of the library it is made with, and
      // which would make the same address answer differently from one app to
      // the next. A language the site does not offer is refused rather than
      // answered in English, so that a mistyped one is found out by the app's
      // author and not by their users.
      const offered = request.server.languages;
      const { language } = request.query;
      const found =
        language === undefined
          ? (languageNamed("en", offered) ?? offered[0])
          : typeof language === "string"
            ? languageNamed(language, offered)
            : undefined;
      if (found === undefined) {
        return refusal(
          reply,
          400,
          "Sports.LanguageNotOffered",
          "The site does not offer that language.",
          "language",
        );
      }
      const speaking = speakingIn(found, offered);

      const sports = sportsOffered[websiteOf(request).site].map((sport) => ({
        code: sport.code,
        name: speaking.say(`sport.${sport.code}`),
      }));

      // By its mark alone: there is no date a list of sports changed on, since
      // it changes only when the site does.
      return sendConditionally(request, reply, { sports }, undefined, {
        byDate: false,
      });
    },
  );
  return Promise.resolve();
};
