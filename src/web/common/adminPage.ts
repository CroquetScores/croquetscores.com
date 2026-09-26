// The admin's page, said into as it is sent. The file is built by Vite ahead of
// time, so it cannot know what is only known once a request has come in: what
// the site is called, whether it is a try website, who is reading, and whether
// they chose light or dark. Every other page is told those as it is rendered (layout.ts),
// and this one is told them here, into the built file, rather than the admin
// asking for them once it is running — which would draw it once in the
// machine's colours and then again in the reader's, and would need the theme
// cookie readable by a script, which it is kept from being (theme.ts).
import type { FastifyRequest } from "fastify";

import { escape } from "./escape.js";
import { speakingOf } from "./language.js";
import { siteBar, siteFooter, tryWebsiteBanner } from "./layout.js";
import { hasPassword, signedIn } from "./reader.js";
import { siteNameOf, websiteOf } from "./site.js";
import { themeOf } from "./theme.js";

// Where each thing is said into the built file. Found by these rather than by
// placeholders in the source, so that the admin's own development server,
// which has no server behind the page to fill anything in, still shows a page
// rather than a row of braces.
const html = /<html([^>]*)>/;
const title = /<title>([^<]*)<\/title>/;
const body = /<body([^>]*)>/;
const bodyEnd = "</body>";

/**
 * The built page, checked once, as the application starts, for everything it
 * is said into. A build that no longer has one of them stops the site starting
 * rather than serving an admin that quietly lost its header or its banner.
 */
export const builtAdminPage = (built: string): string => {
  const missing = [
    html.test(built) ? undefined : "<html>",
    title.test(built) ? undefined : "<title>",
    body.test(built) ? undefined : "<body>",
    built.includes(bodyEnd) ? undefined : bodyEnd,
  ].filter((each) => each !== undefined);
  if (missing.length > 0) {
    throw new Error(
      `The admin's built page has no ${missing.join(", ")} to render into.`,
    );
  }
  return built;
};

/** The admin's page as it is sent to whoever `request` is from. */
export const adminPage = (built: string, request: FastifyRequest): string => {
  const siteName = siteNameOf(request);
  const theme = themeOf(request);
  const speaking = speakingOf(request);
  const lang = speaking.language.tag;

  // Replaced by functions rather than strings throughout, because a string
  // replacement reads $ as the start of a pattern, and a site's name is
  // whatever it was configured as.
  return (
    built
      // In the reader's language rather than the one it was built with, since
      // what the admin draws itself — the months it dates a tournament by —
      // is drawn in whatever the page says it is in.
      .replace(html, (_whole, attributes: string) => {
        const said = `<html lang="${escape(lang)}"${attributes.replace(/\s+lang="[^"]*"/, "")}`;
        return theme === "system"
          ? `${said}>`
          : `${said} data-theme="${theme}">`;
      })
      .replace(
        title,
        (_whole, words: string) =>
          `<title>${escape(siteName)} — ${words}</title>`,
      )
      // The public pages' own header and footer, drawn by the code that draws
      // theirs, rather than a copy of each in the admin that would drift from
      // them. Outside what the admin draws, so that they are on the page before
      // a script runs and whether or not one does. In the reader's language, as
      // on every other page, while the admin's own words are not yet in any: so
      // each says which language it is in, rather than taking the page's word.
      .replace(body, (whole) => {
        const banner = websiteOf(request).isTry
          ? tryWebsiteBanner(speaking, siteName, lang)
          : "";
        return `${whole}${siteBar(
          {
            speaking,
            siteName,
            // Every page of the admin is the admin to the navigation, which
            // has one way in to it however deep the reader has gone.
            currentPath: "/admin/",
            signedIn: signedIn(request),
            hasPassword: hasPassword(request),
          },
          lang,
        )}${banner}`;
      })
      // Back to the address the admin was opened at, as a choice made on a
      // public page returns to that page.
      .replace(
        bodyEnd,
        () =>
          `${siteFooter({ speaking, siteName, theme, path: request.url }, lang)}\n  ${bodyEnd}`,
      )
  );
};
