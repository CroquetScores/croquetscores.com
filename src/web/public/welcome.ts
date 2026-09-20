// Where registering ends. It says an email is on its way, and to follow it,
// and it says so to everyone alike: a page that read differently for an
// address already registered would tell anyone who tried which addresses have
// accounts. So it knows nothing of who arrives and shows nothing of them — not
// even the address they gave, which could only reach it in a URL, where it
// would end up in logs and history. It needs nobody signed in, and no
// scripting.
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";
import { speakingOf } from "../common/language.js";
import { escape } from "../common/escape.js";
import { render } from "../common/layout.js";
import { themeOf } from "../common/theme.js";
import { signedIn } from "../common/reader.js";

export const welcomePath = "/account/welcome";

export const registerWelcomePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(welcomePath, (request, reply) => {
    const speaking = speakingOf(request);
    const { say } = speaking;
    const html = render(assets, {
      title: say("welcome.title"),
      theme: themeOf(request),
      signedIn: signedIn(request),
      speaking,
      path: welcomePath,
      body: `          <h1>${escape(say("welcome.title"))}</h1>
          <p>${escape(say("welcome.checkEmail"))}</p>
          <p>${escape(say("welcome.nothingArrived"))}</p>
          <p><a href="/">${escape(say("welcome.home"))}</a></p>`,
    });

    // Like every other public page, it depends on the theme and language
    // cookies and on the languages the browser asks for, and on nothing else.
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(html);
  });
};
