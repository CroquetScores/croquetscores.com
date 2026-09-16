// A public page is a module exporting what it needs and a function returning
// HTML. No client framework: these pages work with JavaScript switched off.
import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";

export interface Page {
  readonly path: string;
  render(assets: Assets): string;
}

const layout = (
  assets: Assets,
  title: string,
  body: string,
): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="${assets.url("site.css")}" />
  </head>
  <body>
${body}
  </body>
</html>
`;

const home: Page = {
  path: "/",
  render: (assets) =>
    layout(
      assets,
      "Croquet Scores",
      `    <h1>Croquet Scores</h1>
    <p>Scores and commentary as events unfold.</p>`,
    ),
};

export const pages: readonly Page[] = [home];

// An If-None-Match may carry several tags, and a weak validator's W/ prefix
// says only how the tag was derived, not which entity it names.
const matches = (header: string | undefined, etag: string): boolean =>
  header !== undefined &&
  header
    .split(",")
    .map((candidate) => candidate.trim().replace(/^W\//, ""))
    .some((candidate) => candidate === "*" || candidate === etag);

export const registerPublicPages = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  for (const page of pages) {
    server.get(page.path, (request, reply) => {
      const html = page.render(assets);
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
