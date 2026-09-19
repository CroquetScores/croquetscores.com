// A stand-in for registering, until there are accounts. It has the shape
// registering will need and does not pretend to register anyone: submitting it
// says so. It is here so that the dialog has a real page to be shown on, and it
// is replaced by the real thing when accounts arrive.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { Assets } from "../common/assets.js";
import { renderDialog } from "../common/dialog.js";
import { typedFrom, type Typed } from "../common/form.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { themeOf } from "../common/theme.js";
import { javaScriptRequiredPath } from "./javaScriptRequired.js";

const path = "/account/register";
const notOpenPath = `${path}?notice=not-open`;

const show = (
  assets: Assets,
  request: FastifyRequest,
  reply: FastifyReply,
  notOpen: boolean,
  typed: Typed = {},
): FastifyReply => {
  const speaking = speakingOf(request);
  const html = render(assets, {
    title: speaking.say("register.title"),
    theme: themeOf(request),
    speaking,
    // Where choosing a theme or a language comes back to: this page with the
    // notice, when it has one, rather than a bare copy of it with the notice
    // dropped. Not request.url, which after a post is the bare path.
    path: notOpen ? notOpenPath : path,
    currentPath: path,
    frame: "bare",
    // Registering is guarded by reCAPTCHA, which runs in the browser, so a
    // reader without scripting is told so before filling anything in.
    withoutScripting: javaScriptRequiredPath,
    body: renderDialog({
      title: speaking.say("register.title"),
      action: path,
      notice: notOpen ? speaking.say("register.notOpen") : undefined,
      fields: [
        {
          name: "email",
          label: speaking.say("register.emailAddress"),
          type: "email",
          autocomplete: "email",
          value: typed.email,
        },
        {
          name: "password",
          label: speaking.say("register.password"),
          type: "password",
          autocomplete: "new-password",
          // Never written into the page, whatever is given: dialog.ts sees
          // to that. Passed all the same, so this reads like any other field.
          value: typed.password,
        },
      ],
      cancel: { label: speaking.say("register.cancel"), href: "/" },
      submit: speaking.say("register.submit"),
    }),
  });

  // The page depends on the theme and language cookies, and on the languages
  // the browser asks for, like every other public page. One holding what the
  // reader typed is kept by nothing in between.
  return reply
    .header(
      "cache-control",
      typed.email === undefined ? "private, no-cache" : "no-store",
    )
    .header("vary", "Cookie, Accept-Language")
    .type("text/html; charset=utf-8")
    .send(html);
};

export const registerRegisterPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: { notice?: string } }>(path, (request, reply) =>
    show(assets, request, reply, request.query.notice === "not-open"),
  );

  // Nothing is recorded. The form is shown again, saying so, with the email
  // address the reader typed still in it: they should not have to type it
  // twice when registering does open, or lose it to a redirect now. It is not
  // carried in a redirect's address instead, because an email address in a
  // URL ends up in logs and in the browser's history. The password is never
  // written back.
  server.post(path, (request, reply) =>
    show(assets, request, reply, true, typedFrom(request.body)),
  );
};
