// Errors map in one place, so no route decides for itself what a failure looks
// like to a caller.
import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { randomUUID } from "node:crypto";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import type { Assets } from "./assets.js";
import { speakingOf } from "./language.js";
import { siteNameOf, websiteOf } from "./site.js";
import { escape } from "./escape.js";
import { render } from "./layout.js";
import { themeOf } from "./theme.js";
import { hasPassword, signedIn } from "./reader.js";

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
    signedIn: signedIn(request),
    hasPassword: hasPassword(request),
    speaking,
    siteName: siteNameOf(request),
    tryWebsite: websiteOf(request).isTry,
    path: request.url,
    body: `          <h1>${escape(title)}</h1>${
      detail === undefined
        ? ""
        : `\n          <p>${escape(speaking.say(detail, fill))}</p>`
    }
          <p><a href="/">${escape(speaking.say("errors.backHome", { siteName: siteNameOf(request) }))}</a></p>`,
  });
};

// An error page is drawn from the reader's cookies and the languages their
// browser asks for, exactly as every other page is, and the shell it wears
// carries whether the reader is signed in. So it is sent with what every other
// page is sent with: a cache between the site and its readers that kept one
// would hand the next reader a page saying they are somebody.
const sendPage = (
  reply: FastifyReply,
  assets: Assets,
  request: FastifyRequest,
  heading: string,
  detail?: string,
  fill?: Readonly<Record<string, string>>,
): FastifyReply =>
  reply
    .header("cache-control", "private, no-cache")
    .header("vary", "Cookie, Accept-Language")
    .type("text/html; charset=utf-8")
    .send(page(assets, request, heading, detail, fill));

// An API failure is kept by nobody, the caller included. The API answers to a
// bearer token or the session cookie, so a failure can be about whoever asked,
// and unlike a page there is no going back to it: a program that wants to know
// again asks again. So there is nothing to keep it for, which is why this is
// no-store rather than the pages' private, no-cache and a vary to go with it.
const sendJson = (reply: FastifyReply, body: unknown): FastifyReply =>
  reply.header("cache-control", "no-store").send(body);

export const registerErrorMapping = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.setNotFoundHandler((request, reply) => {
    if (wantsJson(request)) {
      return sendJson(reply.code(404), { error: "NotFound" });
    }
    return sendPage(reply.code(404), assets, request, "errors.notFound");
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
        return sendJson(reply.code(422), {
          error: error.code,
          broken: error.broken,
        });
      }
      return sendPage(
        reply.code(422),
        assets,
        request,
        "errors.refused",
        "errors.refusedDetail",
      );
    }

    // A status on the error means something chose it — a route, or Fastify
    // rejecting the request itself — and its message was written to be read,
    // by a program. The API passes it on. A page does not: the message is in
    // English whatever the reader's language, so a page says the catalogue's
    // words for a request that could not be dealt with instead.
    if (typeof error.statusCode === "number") {
      request.log.warn({ err: error }, "Request failed");
      if (wantsJson(request)) {
        return sendJson(reply.code(error.statusCode), {
          error: error.code ?? "Error",
          message: error.message,
        });
      }
      return sendPage(
        reply.code(error.statusCode),
        assets,
        request,
        "errors.sorry",
        "errors.sorryDetail",
      );
    }

    // Everything else is ours and stays ours. The correlation id goes to the
    // log with the cause, and to the caller without it.
    const correlationId = randomUUID();
    request.log.error({ err: error, correlationId }, "Unhandled error");
    if (wantsJson(request)) {
      return sendJson(reply.code(500), { error: "Internal", correlationId });
    }
    return sendPage(
      reply.code(500),
      assets,
      request,
      "errors.failed",
      "errors.reference",
      { reference: correlationId },
    );
  });
};
