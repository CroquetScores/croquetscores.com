// GET /api/v1/tournaments/formats: the formats a tournament may be played in,
// for apps (formats.feature). It says what the site's own page for a new
// tournament says of them, so that an app and the page offer the same choices.
import type { FastifyPluginAsync } from "fastify";

import {
  croquetScoresFormats,
  gateballScoresFormats,
} from "../../../domain/aggregates/tournaments/value-objects/tournamentFormats.js";
import { speakingIn, speakingOf } from "../../common/language.js";
import { websiteOf } from "../../common/site.js";
import { refuseKey } from "./apiKey.js";
import { sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { callerOf } from "./rateLimit.js";

export const formatsOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: { language?: string | string[] } }>(
    "/tournaments/formats",
    (request, reply) => {
      // A key that was sent and does not work is refused, and having none is
      // not, as the list's is (tournaments.ts).
      const caller = callerOf(request);
      if (caller.carriedKey && caller.key === undefined) {
        return refuseKey(reply, true);
      }

      // Said in the address, a language is a choice and not a hint as a
      // browser's list is, so one the site does not have is refused instead of
      // answered in another that the app did not ask for.
      const { language } = request.query;
      let speaking = speakingOf(request);
      if (language !== undefined) {
        // Said twice, it is an array, and no one language was chosen.
        const chosen =
          typeof language === "string"
            ? request.server.languages.find(
                (offered) =>
                  offered.tag.toLowerCase() === language.toLowerCase(),
              )
            : undefined;
        if (chosen === undefined) {
          return refusal(
            reply,
            400,
            "Formats.LanguageNotOffered",
            "The site has no such language: give the tag of one it offers, such as de.",
            "language",
          );
        }
        speaking = speakingIn(chosen, request.server.languages);
      }
      const offered =
        websiteOf(request).site === "gateballScores"
          ? gateballScoresFormats
          : croquetScoresFormats;

      // The code is the name a format is made by (createTournament.feature), so
      // that what an app reads here is what it sends there. Only the name a
      // person is shown is in their language.
      const said = {
        formats: offered.map((format) => ({
          code: format.name,
          name: speaking.say(`format.${format.code}`),
          teams: format.isTeamFormat,
          drawsLevelTests: format.drawsLevelTests,
        })),
      };

      // Said to whoever asks in a language, so that what one language is told is
      // not kept for another. The site's remembered language outranks the
      // header, so the cookie that holds it is named too. There is no date to say it changed by: the list
      // changes only when the site does, which the mark shows.
      reply.header("vary", "Accept-Language, Cookie");
      return sendConditionally(request, reply, said, undefined);
    },
  );
  return Promise.resolve();
};
