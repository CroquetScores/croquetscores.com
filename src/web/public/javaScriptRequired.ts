// Where a reader without scripting is sent from a page that cannot be used
// without it — the register page, which is guarded by reCAPTCHA. It says why,
// and offers the way back for when scripting is on, and the way home. It needs
// no scripting itself, and nobody signed in.
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";
import { speakingOf } from "../common/language.js";
import { escape } from "../common/escape.js";
import { render } from "../common/layout.js";
import { themeOf } from "../common/theme.js";
import { signedIn } from "../common/reader.js";

export const javaScriptRequiredPath = "/account/java-script-required";

const registerPath = "/account/register";

export const registerJavaScriptRequiredPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(javaScriptRequiredPath, (request, reply) => {
    const speaking = speakingOf(request);
    const { say } = speaking;
    const html = render(assets, {
      title: say("javaScriptRequired.title"),
      theme: themeOf(request),
      signedIn: signedIn(request),
      speaking,
      path: javaScriptRequiredPath,
      body: `          <h1>${escape(say("javaScriptRequired.title"))}</h1>
          <p>${escape(say("javaScriptRequired.explanation"))}</p>
          <p><a href="${registerPath}">${escape(say("javaScriptRequired.register"))}</a></p>
          <p><a href="/">${escape(say("javaScriptRequired.home"))}</a></p>`,
    });

    // Like every other public page, it depends on the theme and language
    // cookies and on the languages the browser asks for.
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(html);
  });
};
