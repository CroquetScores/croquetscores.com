// The help, read in the language the rest of the site is in. The pages are
// written once for each language and built by scripts/build-help.mjs; the
// address of a page is the same in every language, so which one a reader is
// shown is decided by what they chose or their browser asks for, as it is on
// every other page, and not by the address.
//
// A page its language has not got is shown in the site's first language
// rather than not at all: a reader asking for help has little use for an
// answer that says there is none.
import { createHash } from "node:crypto";
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
import {
  alertKindOfPage,
  rememberRead,
  releaseOf,
} from "../common/whatsNew.js";

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

// The pictures of a page, named by the language the page was written in.
const pictured = (html: string, tag: string): string =>
  html.split(`src="${helpImagesPath}/`).join(`src="${helpImagesPath}/${tag}/`);

// The address of the privacy statement, a page of the help's library that has
// an address of its own so that it can be linked to from every page.
export const privacyPath = "/privacy";
const privacyName = "privacy";

// The sentence that says who to ask, with the address in it made a link that
// opens a new message to it. The words are the catalogue's, so the address is
// found in them after they are escaped, which is how it was put there.
const asking = (said: string, emailAddress: string): string => {
  const address = escape(emailAddress);
  return escape(said).replace(
    address,
    `<a href="mailto:${address}">${address}</a>`,
  );
};

export const registerHelpPages = (
  server: FastifyInstance,
  assets: Assets,
  library: HelpLibrary,
  administrator: string | undefined,
): void => {
  // A picture shows the site in a language, and the address says which, so
  // that the pictures of a page are those of the language the page was written
  // in and not of the reader's: an English page shown to a Welsh reader names
  // English buttons. The first language's picture is shown where the language
  // asked for has none, as a page is.
  server.get<{ Params: { "*": string } }>(
    `${helpImagesPath}/*`,
    async (request, reply) => {
      const asked = request.params["*"];
      const slash = asked.indexOf("/");
      const tag = asked.slice(0, slash);
      const name = asked.slice(slash + 1);
      const fallback = server.languages[0];
      const offered = server.languages.some((each) => each.tag === tag);
      const image =
        slash === -1 || !offered || fallback === undefined
          ? undefined
          : ((await library.image(tag, name)) ??
            (await library.image(fallback.tag, name)));
      if (image === undefined) {
        reply.callNotFound();
        return reply;
      }
      // Revalidated rather than kept for a day: the pictures are made again
      // under the same names, and a reader should not see old ones beside new
      // words.
      const etag = `"${createHash("sha1").update(image).digest("base64url")}"`;
      reply
        .header("cache-control", "public, no-cache")
        .header("etag", etag)
        .header("x-content-type-options", "nosniff");
      if (request.headers["if-none-match"] === etag) {
        return reply.code(304).send();
      }
      return reply.type(typeOf(name)).send(image);
    },
  );

  const show = async (
    request: FastifyRequest,
    reply: FastifyReply,
    name: string,
    atItsOwnAddress = false,
  ): Promise<FastifyReply> => {
    // The statement has one address, which is its own and not the help's.
    if (name === privacyName && !atItsOwnAddress) {
      reply.callNotFound();
      return reply;
    }
    const speaking = speakingOf(request);
    const fallback = server.languages[0];
    const own = await library.page(speaking.language.tag, name);
    const inFirst =
      own !== undefined || fallback === undefined
        ? undefined
        : await library.page(fallback.tag, name);
    const page = own ?? inFirst;
    const writtenIn = own === undefined ? fallback : speaking.language;
    if (page === undefined || writtenIn === undefined) {
      reply.callNotFound();
      return reply;
    }

    // Being shown a page of what's new is what has the alert go quiet, however
    // the reader came to it. By the release the first language's page names,
    // which is the one the alert goes by.
    const kind = alertKindOfPage(name);
    if (kind !== undefined) {
      const released = await releaseOf(library, fallback?.tag, kind);
      if (released !== undefined) rememberRead(request, reply, kind, released);
    }

    const html = render(assets, {
      title: page.title,
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: name === privacyName ? privacyPath : helpPath,
      // The article says which language it is in and which page it is, so that
      // a reader's browser and screen reader read it in the language it is
      // written in even where the site around it is in another.
      body: `          <article class="help" lang="${escape(writtenIn.tag)}"${directionAttribute(writtenIn)} data-page="${escape(name)}">
${pictured(page.html, writtenIn.tag)}
          </article>${
            name === privacyName && administrator !== undefined
              ? `
          <p>${asking(speaking.say("privacy.contact", { emailAddress: administrator }), administrator)}</p>`
              : ""
          }`,
    });

    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(html);
  };

  server.get(privacyPath, (request, reply) =>
    show(request, reply, privacyName, true),
  );
  server.get(helpPath, (request, reply) => show(request, reply, ""));
  server.get<{ Params: { "*": string } }>(`${helpPath}/*`, (request, reply) => {
    const name = request.params["*"].replace(/\/+$/, "");
    return show(request, reply, name);
  });
};
