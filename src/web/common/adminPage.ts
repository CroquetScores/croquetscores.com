// The admin's page, said into as it is sent. The file is built by Vite ahead of
// time, so it cannot know what is only known once a request has come in: what
// the site is called, whether it is a try website, and whether the reader chose
// light or dark. Every other page is told those as it is rendered (layout.ts),
// and this one is told them here, into the built file, rather than the admin
// asking for them once it is running — which would draw it once in the
// machine's colours and then again in the reader's, and would need the theme
// cookie readable by a script, which it is kept from being (theme.ts).
import type { FastifyRequest } from "fastify";

import { escape } from "./escape.js";
import { speakingOf } from "./language.js";
import { themeChoice, tryWebsiteBanner } from "./layout.js";
import { siteNameOf, websiteOf } from "./site.js";
import { themeOf } from "./theme.js";

// Where each thing is said into the built file. Found by these rather than by
// placeholders in the source, so that the admin's own development server,
// which has no server behind the page to fill anything in, still shows a page
// rather than a row of braces.
const html = /<html([^>]*)>/;
const title = /<title>([^<]*)<\/title>/;
const headEnd = "</head>";
const body = /<body([^>]*)>/;
const bodyEnd = "</body>";

/**
 * The built page, checked once, as the application starts, for everything it
 * is said into. A build that no longer has one of them stops the site starting
 * rather than serving an admin that quietly lost its name or its banner.
 */
export const builtAdminPage = (built: string): string => {
  const missing = [
    html.test(built) ? undefined : "<html>",
    title.test(built) ? undefined : "<title>",
    built.includes(headEnd) ? undefined : headEnd,
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

  // Replaced by functions rather than strings throughout, because a string
  // replacement reads $ as the start of a pattern, and a site's name is
  // whatever it was configured as.
  return (
    built
      .replace(html, (_whole, attributes: string) =>
        theme === "system"
          ? `<html${attributes}>`
          : `<html${attributes} data-theme="${theme}">`,
      )
      .replace(
        title,
        (_whole, words: string) =>
          `<title>${escape(siteName)} — ${words}</title>`,
      )
      // The name the admin draws in its bar, which it reads from here: a page
      // built ahead of time has nowhere else to learn it from.
      .replace(
        headEnd,
        () =>
          `  <meta name="application-name" content="${escape(siteName)}" />\n  ${headEnd}`,
      )
      // Outside what the admin draws, so that it is on the page before a script
      // runs and whether or not one does. In the reader's language, as it is on
      // every other page, while the admin's own words are not yet in any: so it
      // says which language it is in, rather than taking the page's word.
      .replace(body, (whole) =>
        websiteOf(request).isTry
          ? `${whole}${tryWebsiteBanner(speaking, siteName, speaking.language.tag)}`
          : whole,
      )
      // The public footer's own choice of light or dark, beneath whatever the
      // admin draws, so that it is made the way it is made there: a form posted
      // with no scripting, back to the address the admin was opened at. Only
      // the choice, since the rest of that footer is for a reader of the public
      // pages rather than for whoever is running the site.
      .replace(
        bodyEnd,
        () => `  <footer class="site-footer" lang="${escape(speaking.language.tag)}">
      <div class="page">
        <div class="site-footer-theme">
${themeChoice(speaking, theme, request.url)}
        </div>
      </div>
    </footer>
  ${bodyEnd}`,
      )
  );
};
