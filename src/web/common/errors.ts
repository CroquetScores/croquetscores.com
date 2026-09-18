// Errors map in one place, so no route decides for itself what a failure looks
// like to a caller.
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import type { Assets } from "./assets.js";
import { speakingOf } from "./language.js";
import { escape, render } from "./layout.js";
import { themeOf } from "./theme.js";

// The API answers JSON and the public pages answer HTML, including when they
// fail. A browser should not be handed a JSON body for a page it asked for.
const wantsJson = (request: FastifyRequest): boolean =>
  request.url.startsWith("/api/");

// An error page is still a page of this site, so it wears the same shell and
// speaks the reader's language. Its words are named by what they are for, and
// said here, so nothing outside the catalogue reaches the reader.
const page = (
  assets: Assets,
  request: FastifyRequest,
  heading: string,
  detail?: string,
  fill?: Readonly<Record<string, string>>,
): string => {
  const speaking = speakingOf(request);
  const title = speaking.say(heading);
  return render(assets, {
    title,
    theme: themeOf(request),
    speaking,
    path: request.url,
    body: `          <h1>${escape(title)}</h1>${
      detail === undefined
        ? ""
        : `\n          <p>${escape(speaking.say(detail, fill))}</p>`
    }
          <p><a href="/">${escape(speaking.say("errors.backHome"))}</a></p>`,
  });
};

export const registerErrorMapping = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.setNotFoundHandler((request, reply) => {
    if (wantsJson(request)) return reply.code(404).send({ error: "NotFound" });
    return reply
      .code(404)
      .type("text/html; charset=utf-8")
      .send(page(assets, request, "errors.notFound"));
  });

  server.setErrorHandler((error: FastifyError, request, reply) => {
    // A request that broke its rules is the caller's mistake, not the server's,
    // and is neither answered nor logged as the server failing. The caller is
    // owed every rule it broke, by code, so that it can say so to whoever typed
    // it. A form does not get here: it shows itself again (form.ts). What gets
    // here is the API, and a page that has no form to show.
    //
    // The mediator's other refusals — a request nobody handles, one through the
    // wrong door — are mistakes in how the application was put together, which
    // the caller could have done nothing about, so they fall through to be the
    // server's own failure below.
    if (error instanceof RequestInvalid) {
      request.log.info({ broken: error.broken }, "Request refused");
      if (wantsJson(request)) {
        return reply
          .code(422)
          .send({ error: error.code, broken: error.broken });
      }
      return reply
        .code(422)
        .type("text/html; charset=utf-8")
        .send(page(assets, request, "errors.refused", "errors.refusedDetail"));
    }

    // A status on the error means something chose it — a route, or Fastify
    // rejecting the request itself — and its message was written to be read,
    // by a program. The API passes it on. A page does not: the message is in
    // English whatever the reader's language, so a page says the catalogue's
    // words for a request that could not be dealt with instead.
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
        .send(page(assets, request, "errors.sorry", "errors.sorryDetail"));
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
        page(assets, request, "errors.failed", "errors.reference", {
          reference: correlationId,
        }),
      );
  });
};
