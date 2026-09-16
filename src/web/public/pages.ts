// A public page is a module exporting what it needs and a function returning
// HTML. No client framework: these pages work with JavaScript switched off.
import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";

export interface Page {
  readonly path: string;
  render(): string;
}

const layout = (title: string, body: string): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="/assets/site.css" />
  </head>
  <body>
${body}
  </body>
</html>
`;

const home: Page = {
  path: "/",
  render: () =>
    layout(
      "Croquet Scores",
      `    <h1>Croquet Scores</h1>
    <p>Scores and commentary as events unfold.</p>`,
    ),
};

export const pages: readonly Page[] = [home];

export const registerPublicPages = (server: FastifyInstance): void => {
  for (const page of pages) {
    server.get(page.path, (_request, reply) => {
      const html = page.render();
      const etag = `"${createHash("sha256").update(html).digest("base64url").slice(0, 27)}"`;
      return reply
        .header("cache-control", "public, max-age=60")
        .header("etag", etag)
        .type("text/html; charset=utf-8")
        .send(html);
    });
  }
};
