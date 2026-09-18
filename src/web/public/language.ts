// Where the language choice in the footer posts. It records the choice and
// sends the reader back where they were, which is what makes it work with
// JavaScript switched off, as the theme's does.
import type { FastifyInstance } from "fastify";

import { parseLanguage, rememberLanguage } from "../common/language.js";
import { safeReturnPath } from "../common/theme.js";

interface LanguageForm {
  readonly language?: unknown;
  readonly return?: unknown;
}

export const registerLanguageRoute = (server: FastifyInstance): void => {
  server.post<{ Body: LanguageForm }>("/language", (request, reply) => {
    // Only a language the site offers. Anything else would be kept in the
    // cookie and ignored on every page after, which is a choice that did
    // nothing and said so nowhere.
    const language = parseLanguage(request.body?.language, server.languages);
    if (language === undefined) {
      return reply.code(400).send({ error: "Language.Unrecognised" });
    }

    rememberLanguage(reply, language);

    // 303, so the browser follows with a GET and the back button does not offer
    // to post the form again.
    return reply.redirect(safeReturnPath(request.body?.return), 303);
  });
};
