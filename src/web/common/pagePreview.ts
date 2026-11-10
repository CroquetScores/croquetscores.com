// What a link to a page shows, and the one address a page is known by, put into
// each page as it is sent, where they are found by the head's closing tag,
// rather than drawn by each page as it is rendered: a canonical link and a
// preview that every page had to remember are ones the next page forgets, as
// the beta notice would have been (betaSite.ts).
//
// The page's own words, its title and any description it gave itself, are read
// out of what it drew, so that what is previewed is what is on the page and
// the two cannot come to say different things. A page that gave no description
// says what the site is, which is also what every page with nothing to say of
// itself says (pageDescription.feature).
//
// Only for a page a reader is sent to: an answer that is not a page, or is not
// found, is none, and nor are the admin and the API, which are not for a search
// engine to find (canonicalLink.feature).
import type { FastifyInstance } from "fastify";

import { escape } from "./escape.js";
import { speakingOf } from "./language.js";
import { siteNameOf } from "./site.js";

// How each language is written in the places that read Open Graph, which want
// a language and a country: "en_US". Kept here rather than in a language's own
// file, since it is for the preview and no page shows it.
const locales: Readonly<Record<string, string>> = {
  af: "af_ZA",
  "ar-EG": "ar_EG",
  cs: "cs_CZ",
  cy: "cy_GB",
  de: "de_DE",
  el: "el_GR",
  en: "en_US",
  es: "es_ES",
  lv: "lv_LV",
  nb: "nb_NO",
  pt: "pt_PT",
  sv: "sv_SE",
};

const title = /<title>([^<]*)<\/title>/;
const description = /<meta name="description" content="([^"]*)"/;
const headEnd = "</head>";

const isForReaders = (path: string): boolean =>
  !/^\/(admin|api)(\/|$)/.test(path);

export const registerPagePreview = (server: FastifyInstance): void => {
  server.addHook("onSend", (request, reply, payload, done) => {
    const path = request.url.split("?")[0]!;
    const type = String(reply.getHeader("content-type") ?? "");
    if (
      typeof payload !== "string" ||
      reply.statusCode !== 200 ||
      !type.startsWith("text/html") ||
      !isForReaders(path) ||
      request.servedAs === undefined ||
      !payload.includes(headEnd)
    ) {
      done(null, payload);
      return;
    }

    const speaking = speakingOf(request);
    const siteName = siteNameOf(request);
    const named = title.exec(payload)?.[1] ?? escape(siteName);
    const given = description.exec(payload)?.[1];
    const said =
      given ?? escape(speaking.say("meta.description", { siteName }));
    const address = `${request.servedAs.address}${path}`;

    const tags = [
      ...(given === undefined
        ? [`<meta name="description" content="${said}" />`]
        : []),
      `<link rel="canonical" href="${escape(address)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${escape(siteName)}" />`,
      `<meta property="og:title" content="${named}" />`,
      `<meta property="og:description" content="${said}" />`,
      `<meta property="og:url" content="${escape(address)}" />`,
      `<meta property="og:locale" content="${escape(locales[speaking.language.tag] ?? "en_US")}" />`,
      `<meta name="twitter:card" content="summary" />`,
    ]
      .map(
        (tag) => `    ${tag}
`,
      )
      .join("");

    // The length it was sent with is for the page without them.
    reply.removeHeader("content-length");
    done(null, payload.replace(headEnd, `${tags}  ${headEnd}`));
  });
};
