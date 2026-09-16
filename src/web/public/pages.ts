// A public page is a module naming what it needs and returning HTML. No client
// framework: these pages work with JavaScript switched off, which is what
// decides the shape of the navigation below.
import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";

export interface Page {
  readonly path: string;
  /** The <title>, and the heading the page leads with. */
  readonly title: string;
  /** How the page names itself in the navigation, which has less room. */
  readonly navLabel: string;
  body(): string;
}

const escape = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

// Generated from the pages themselves, so a page that exists is a page that can
// be reached and there is no second list to keep true beside the first. /admin
// is the one entry that is not a public page; it is still part of this site.
const navigation = (current: Page): string => {
  const links = [
    ...pages.map((page) => ({ href: page.path, label: page.navLabel })),
    { href: "/admin", label: "Admin" },
  ];

  const items = links
    .map(({ href, label }) => {
      const here = href === current.path ? ' aria-current="page"' : "";
      return `          <li><a href="${href}"${here}>${escape(label)}</a></li>`;
    })
    .join("\n");

  return `      <details class="menu">
        <summary><span class="visually-hidden">Menu</span></summary>
        <nav class="menu-links" aria-label="Primary">
          <ul>
${items}
          </ul>
        </nav>
      </details>`;
};

const layout = (assets: Assets, page: Page): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(page.title)}</title>
    <link rel="stylesheet" href="${assets.url("site.css")}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header">
      <div class="page">
        <a class="site-name" href="/">Croquet Scores</a>
${navigation(page)}
      </div>
    </header>
    <main id="content">
      <div class="page stack stack-loose">
${page.body()}
      </div>
    </main>
    <footer class="site-footer">
      <div class="page">Croquet Scores</div>
    </footer>
  </body>
</html>
`;

const home: Page = {
  path: "/",
  title: "Croquet Scores",
  navLabel: "Scores",
  body: () => `        <h1>Croquet Scores</h1>
        <p class="lead">Scores and commentary as events unfold.</p>`,
};

export const pages: readonly Page[] = [home];

export const registerPublicPages = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  for (const page of pages) {
    server.get(page.path, (request, reply) => {
      const html = layout(assets, page);
      const etag = `"${createHash("sha256").update(html).digest("base64url").slice(0, 27)}"`;

      reply.header("cache-control", "public, max-age=60").header("etag", etag);

      // Without this the ETag costs a hash on every request and saves nothing:
      // Fastify does no conditional-request handling of its own.
      if (matches(request.headers["if-none-match"], etag)) {
        return reply.code(304).send();
      }

      return reply.type("text/html; charset=utf-8").send(html);
    });
  }
};

// An If-None-Match may carry several tags, and a weak validator's W/ prefix
// says only how the tag was derived, not which entity it names.
const matches = (header: string | undefined, etag: string): boolean =>
  header !== undefined &&
  header
    .split(",")
    .map((candidate) => candidate.trim().replace(/^W\//, ""))
    .some((candidate) => candidate === "*" || candidate === etag);
