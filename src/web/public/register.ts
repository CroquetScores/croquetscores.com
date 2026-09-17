// A stand-in for registering, until there are accounts. It has the shape
// registering will need and does not pretend to register anyone: submitting it
// says so. It is here so that the dialog has a real page to be shown on, and it
// is replaced by the real thing when accounts arrive.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { Assets } from "../common/assets.js";
import { renderDialog } from "../common/dialog.js";
import { render } from "../common/layout.js";
import { themeOf } from "../common/theme.js";

const path = "/accounts/register";

const notOpen = "Registering is not open yet.";

const show = (
  assets: Assets,
  request: FastifyRequest,
  reply: FastifyReply,
  notice: string | undefined,
): FastifyReply => {
  const html = render(assets, {
    title: "Register",
    theme: themeOf(request),
    path,
    currentPath: path,
    frame: "bare",
    body: renderDialog({
      title: "Register",
      action: path,
      notice,
      fields: [
        {
          name: "email",
          label: "Email address",
          type: "email",
          autocomplete: "email",
          // For testing only: the stand-in shows every message all the time so
          // there is always one whose look can be checked. A real form shows a
          // message only when its field needs attention.
          message: "Enter an email address.",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          autocomplete: "new-password",
          message: "Enter a password.",
        },
      ],
      cancel: { label: "Cancel", href: "/" },
      submit: "Register",
    }),
  });

  // The page depends on the theme cookie, like every other public page.
  return reply
    .header("cache-control", "private, no-cache")
    .header("vary", "Cookie")
    .type("text/html; charset=utf-8")
    .send(html);
};

export const registerRegisterPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: { notice?: string } }>(path, (request, reply) =>
    show(
      assets,
      request,
      reply,
      request.query.notice === "not-open" ? notOpen : undefined,
    ),
  );

  // Nothing is recorded. Answered with 303 back to the page, so the notice is
  // shown by a GET and refreshing it does not offer to post the form again.
  // What was typed is not sent back: there is nowhere for it to go yet, and a
  // password is never something to echo into a page.
  server.post(path, (_request, reply) =>
    reply.redirect(`${path}?notice=not-open`, 303),
  );
};
