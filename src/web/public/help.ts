// The help, read in the language the rest of the site is in. The pages are
// written once for each language and built by scripts/build-help.mjs; the
// address of a page is the same in every language, so which one a reader is
// shown is decided by what they chose or their browser asks for, as it is on
// every other page, and not by the address.
//
// A page its language has not got is shown in the site's first language
// rather than not at all: a reader asking for help has little use for an
// answer that says there is none.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { helpImagesPath, helpPath } from "../common/helpPages.js";
import type { HelpLibrary } from "../common/helpLibrary.js";
import { render } from "../common/layout.js";
import { directionAttribute, speakingOf } from "../common/language.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";

const imageTypes: Readonly<Record<string, string>> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const typeOf = (name: string): string =>
  imageTypes[name.slice(name.lastIndexOf(".")).toLowerCase()] ??
  "application/octet-stream";

export const registerHelpPages = (
  server: FastifyInstance,
  assets: Assets,
  library: HelpLibrary,
): void => {
  // A picture is one file whatever language the page is in, so it is the one
  // answer that does not depend on the reader, and may be kept.
  server.get<{ Params: { "*": string } }>(
    `${helpImagesPath}/*`,
    async (request, reply) => {
      const name = request.params["*"];
      const image = await library.image(name);
      if (image === undefined) {
        reply.callNotFound();
        return reply;
      }
      return reply
        .header("cache-control", "public, max-age=86400")
        .type(typeOf(name))
        .send(image);
    },
  );

  const show = async (
    request: FastifyRequest,
    reply: FastifyReply,
    name: string,
  ): Promise<FastifyReply> => {
    const speaking = speakingOf(request);
    const fallback = server.languages[0];
    const own = await library.page(speaking.language.tag, name);
    const page =
      own ??
      (fallback === undefined
        ? undefined
        : await library.page(fallback.tag, name));
    if (page === undefined || fallback === undefined) {
      reply.callNotFound();
      return reply;
    }
    const writtenIn = own === undefined ? fallback : speaking.language;

    const html = render(assets, {
      title: page.title,
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: helpPath,
      // The article says which language it is in and which page it is, so that
      // a reader's browser and screen reader read it in the language it is
      // written in even where the site around it is in another.
      body: `          <article class="help" lang="${escape(writtenIn.tag)}"${directionAttribute(writtenIn)} data-page="${escape(name)}">
${page.html}
          </article>`,
    });

    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(html);
  };

  server.get(helpPath, (request, reply) => show(request, reply, ""));
  server.get<{ Params: { "*": string } }>(`${helpPath}/*`, (request, reply) => {
    const name = request.params["*"].replace(/\/+$/, "");
    return show(request, reply, name);
  });
};
