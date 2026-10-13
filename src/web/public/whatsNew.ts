// Where the alert about what's new posts the reader's choice. It records the
// choice and sends the reader back where they were, which is what makes it work
// with scripting switched off, as the theme's does.
import type { FastifyInstance } from "fastify";

import type { HelpLibrary } from "../common/helpLibrary.js";
import { safeReturnPath } from "../common/theme.js";
import {
  parseAlertKind,
  parseChoice,
  releaseOf,
  rememberChoice,
  whatsNewChoicePath,
} from "../common/whatsNew.js";

interface WhatsNewForm {
  readonly alert?: unknown;
  readonly choice?: unknown;
  readonly return?: unknown;
}

export const registerWhatsNewRoute = (
  server: FastifyInstance,
  library: HelpLibrary,
): void => {
  server.post<{ Body: WhatsNewForm }>(
    whatsNewChoicePath,
    async (request, reply) => {
      const kind = parseAlertKind(request.body?.alert);
      const choice = parseChoice(request.body?.choice);
      if (kind === undefined || choice === undefined) {
        return reply.code(400).send({ error: "WhatsNew.Unrecognised" });
      }

      // Asked of the help now rather than carried in the form, which anybody can
      // write anything in.
      const released = await releaseOf(library, server.languages[0]?.tag, kind);
      rememberChoice(reply, kind, choice, released);

      // 303, so the browser follows with a GET and the back button does not offer
      // to post the form again.
      return reply.redirect(safeReturnPath(request.body?.return), 303);
    },
  );
};
