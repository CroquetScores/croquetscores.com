// The one endpoint the public side posts to. It records a preference and sends
// the reader back where they were, which is what makes the control work with
// JavaScript switched off.
import type { FastifyInstance } from "fastify";

import { parseTheme, rememberTheme, safeReturnPath } from "../common/theme.js";

interface ThemeForm {
  readonly theme?: unknown;
  readonly return?: unknown;
}

export const registerThemeRoute = (server: FastifyInstance): void => {
  server.post<{ Body: ThemeForm }>("/theme", (request, reply) => {
    const theme = parseTheme(request.body?.theme);
    if (theme === undefined) {
      return reply.code(400).send({ error: "Theme.Unrecognised" });
    }

    rememberTheme(reply, theme);

    // 303, so the browser follows with a GET and the back button does not offer
    // to post the form again.
    return reply.redirect(safeReturnPath(request.body?.return), 303);
  });
};
