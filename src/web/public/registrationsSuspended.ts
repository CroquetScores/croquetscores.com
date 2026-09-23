// Where a reader registering is sent when reCAPTCHA cannot be reached to judge
// them. It says registering is suspended for now and to try again later, and
// says it to everybody alike. Nothing stays suspended: each registration asks
// afresh, so this page stops being where anybody is sent the moment reCAPTCHA
// answers again.
//
// It needs no scripting and nobody signed in.
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { siteNameOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { themeOf } from "../common/theme.js";

export const registrationsSuspendedPath = "/account/registrations-suspended";

export const registerRegistrationsSuspendedPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(registrationsSuspendedPath, (request, reply) => {
    const speaking = speakingOf(request);
    const { say } = speaking;
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: say("registrationsSuspended.title"),
          theme: themeOf(request),
          signedIn: signedIn(request),
          speaking,
          siteName: siteNameOf(request),
          path: registrationsSuspendedPath,
          body: `          <h1>${escape(say("registrationsSuspended.title"))}</h1>
          <p>${escape(say("registrationsSuspended.explanation"))}</p>
          <p>${escape(say("registrationsSuspended.tryAgainLater"))}</p>
          <p><a href="/">${escape(say("registrationsSuspended.home", { siteName: siteNameOf(request) }))}</a></p>`,
        }),
      );
  });
};
