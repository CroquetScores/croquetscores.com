// Errors map in one place, so no route decides for itself what a failure looks
// like to a caller.
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

import type { Assets } from "./assets.js";
import { escape, render } from "./layout.js";

// The API answers JSON and the public pages answer HTML, including when they
// fail. A browser should not be handed a JSON body for a page it asked for.
const wantsJson = (request: FastifyRequest): boolean =>
  request.url.startsWith("/api/");

// An error page is still a page of this site, so it wears the same shell.
const page = (assets: Assets, heading: string, detail?: string): string =>
  render(assets, {
    title: heading,
    body: `          <h1>${escape(heading)}</h1>${
      detail === undefined ? "" : `\n          <p>${escape(detail)}</p>`
    }
          <p><a href="/">Back to Croquet Scores</a></p>`,
  });

export const registerErrorMapping = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.setNotFoundHandler((request, reply) => {
    if (wantsJson(request)) return reply.code(404).send({ error: "NotFound" });
    return reply
      .code(404)
      .type("text/html; charset=utf-8")
      .send(page(assets, "Not found"));
  });

  server.setErrorHandler((error: FastifyError, request, reply) => {
    // A status on the error means something chose it — a route, or Fastify
    // rejecting the request itself — and its message was written to be read.
    if (typeof error.statusCode === "number") {
      request.log.warn({ err: error }, "Request failed");
      if (wantsJson(request)) {
        return reply
          .code(error.statusCode)
          .send({ error: error.code ?? "Error", message: error.message });
      }
      return reply
        .code(error.statusCode)
        .type("text/html; charset=utf-8")
        .send(page(assets, "Sorry", error.message));
    }

    // Everything else is ours and stays ours. The correlation id goes to the
    // log with the cause, and to the caller without it.
    const correlationId = randomUUID();
    request.log.error({ err: error, correlationId }, "Unhandled error");
    if (wantsJson(request)) {
      return reply.code(500).send({ error: "Internal", correlationId });
    }
    return reply
      .code(500)
      .type("text/html; charset=utf-8")
      .send(
        page(assets, "Something went wrong", `Reference ${correlationId}.`),
      );
  });
};
