// GET /api/v0/countries: the countries there are and the regions of each, for
// apps (countries.feature). It was only at /api/site/tournaments/new, which is
// for the signed-in reader of the website's own form and carries much else.
import type { FastifyPluginAsync } from "fastify";

import { countriesSpokenIn } from "../../common/countryList.js";
import { parseLanguage, speakingIn } from "../../common/language.js";
import { refuseKey } from "./apiKey.js";
import { sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { callerOf } from "./rateLimit.js";

interface Asked {
  readonly language?: string;
}

export const countriesOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: Asked }>("/countries", (request, reply) => {
    // A key that was sent and does not work is refused, and having none is
    // not, as the list of tournaments does (tournaments.ts).
    const caller = callerOf(request);
    if (caller.carriedKey && caller.key === undefined) {
      return refuseKey(reply, true);
    }

    // Only what the address says chooses the language. The cookie and the
    // browser's headers that choose it for the site's pages are not looked at,
    // so that an app which did not ask is answered as it was the last time. A
    // language the site does not offer is refused rather than answered in
    // English, which an app would show without knowing it was not the one asked.
    const offered = request.server.languages;
    const { language } = request.query;
    // English is looked for by its tag and not taken as the site's first
    // language, which is only the one it falls back to and could be another.
    const chosen =
      language === undefined
        ? (offered.find(({ tag }) => tag === "en") ?? offered[0])
        : parseLanguage(language, offered);
    if (chosen === undefined) {
      return refusal(
        reply,
        400,
        "Countries.LanguageUnknown",
        "The site has no language with that tag.",
        "language",
      );
    }

    const said = { countries: countriesSpokenIn(speakingIn(chosen, offered)) };

    // By its mark alone: nothing says when the list last changed, since it
    // changes only when the site is deployed.
    return sendConditionally(request, reply, said, undefined, {
      byDate: false,
    });
  });
  return Promise.resolve();
};
