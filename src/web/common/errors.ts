// Errors map in one place, so no route decides for itself what a failure looks
// like to a caller.
import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { randomUUID } from "node:crypto";

import { DatabaseUnreachable } from "../../application/common/DatabaseUnreachable.js";
import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { DatabaseAccessRefused } from "../../application/common/DatabaseAccess.js";
import { RoleOperationRefused } from "../../application/operations/accounts/roleOperations.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import { LogEntriesRefused } from "../../application/operations/logs/LogEntriesHandler.js";
import { ImportErrorKeptRefused } from "../../application/operations/import-errors/ImportErrorKeptHandler.js";
import { WorldRankingPlayersRefused } from "../../application/operations/world-rankings/WorldRankingPlayersMatchingHandler.js";
import { ManagerNoteRefused } from "../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { CompetitionRefused } from "../../domain/aggregates/tournaments/competitions/Competition.js";
import { TournamentRefused } from "../../domain/aggregates/tournaments/Tournament.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";
import type { Assets } from "./assets.js";
import { speakingOf } from "./language.js";
import { siteNameOf, websiteOf } from "./site.js";
import { escape } from "./escape.js";
import { render } from "./layout.js";
import { themeOf } from "./theme.js";
import type { DatabaseOutage } from "./databaseOutage.js";
import type { ErrorReport } from "./errorReport.js";
import { hasPassword, readerKnown, signedIn } from "./reader.js";

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
  more = "",
): string => {
  const speaking = speakingOf(request);
  const title = speaking.say(heading);
  return render(assets, {
    title,
    theme: themeOf(request),
    signedIn: signedIn(request),
    hasPassword: hasPassword(request),
    readerKnown: readerKnown(request),
    speaking,
    siteName: siteNameOf(request),
    tryWebsite: websiteOf(request).isTry,
    path: request.url,
    body: `          <h1>${escape(title)}</h1>${
      detail === undefined
        ? ""
        : `\n          <p>${escape(speaking.say(detail, fill))}</p>`
    }${more}
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
  more?: string,
): FastifyReply =>
  reply
    .header("cache-control", "private, no-cache")
    .header("vary", "Cookie, Accept-Language")
    .type("text/html; charset=utf-8")
    .send(page(assets, request, heading, detail, fill, more));

// An API failure is kept by nobody, the caller included. The API answers to a
// bearer token or the session cookie, so a failure can be about whoever asked,
// and unlike a page there is no going back to it: a program that wants to know
// again asks again. So there is nothing to keep it for, which is why this is
// no-store rather than the pages' private, no-cache and a vary to go with it.
const sendJson = (reply: FastifyReply, body: unknown): FastifyReply =>
  reply.header("cache-control", "no-store").send(body);

// How long a program is told to wait before asking again. A guess at how
// long it takes a database to come back from a restart, said in seconds as
// Retry-After wants it; nothing waits on it being right.
const retryAfterSeconds = "30";

export const registerErrorMapping = (
  server: FastifyInstance,
  assets: Assets,
  databaseOutage: DatabaseOutage,
  errorReport: ErrorReport,
  administrator: string,
): void => {
  server.setNotFoundHandler((request, reply) => {
    if (wantsJson(request)) {
      return sendJson(reply.code(404), { error: "NotFound" });
    }
    return sendPage(reply.code(404), assets, request, "errors.notFound");
  });

  server.setErrorHandler(async (error: FastifyError, request, reply) => {
    // The database being out of reach is the site being unable to answer, and
    // is said as that: not the caller's mistake, and not the server having
    // been built wrongly, which is what falling through would say. It is
    // answered the same for a page and for the API, with what to do about it,
    // and without where the database is, which is for the log.
    if (error instanceof DatabaseUnreachable) {
      request.log.error(
        { err: error, code: error.code },
        "The database could not be reached.",
      );
      databaseOutage.tell(request);
      reply.header("retry-after", retryAfterSeconds);
      if (wantsJson(request)) {
        return sendJson(reply.code(503), { error: error.code });
      }
      return sendPage(
        reply.code(503),
        assets,
        request,
        "errors.unavailable",
        "errors.unavailableDetail",
      );
    }

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

    // A tournament's refusal is as much the caller's to hear as a broken rule:
    // a tournament that finishes before it starts, a reader who no longer
    // manages it. The API passes on its code, which is the contract, for the
    // caller to say in its own words. A page has no form here to show again,
    // so it falls through to what it did before.
    //
    // Named kind by kind rather than as any refusal, because most refusals are
    // not the caller's: the mediator's, the event store's and the database's
    // are the server failing, and must reach the log as that below.
    //
    // So is a competition's refusal, and a note's, which refuses what is asked
    // of it once it is deleted, and a rule the thing asked for broke once
    // what it needed of the tournament was known — a game with a tie and no
    // mark saying who won, a player who has withdrawn — which the score
    // dialog says beside the field it is about.
    //
    // So is a refusal to give, take or list a role, which the accounts page
    // says beneath the field it is about, and a refusal to find world ranking
    // players of a sport that has none, and to read the error of a document the
    // import kept none against, and the minutes or words database access is
    // asked to be turned off with when they are not allowed.
    if (
      (error instanceof TournamentRefused ||
        error instanceof TournamentOperationRefused ||
        error instanceof RoleOperationRefused ||
        error instanceof DatabaseAccessRefused ||
        error instanceof WorldRankingPlayersRefused ||
        error instanceof ImportErrorKeptRefused ||
        error instanceof LogEntriesRefused ||
        error instanceof CompetitionRefused ||
        error instanceof ManagerNoteRefused ||
        error instanceof ValidationError) &&
      wantsJson(request)
    ) {
      request.log.info({ code: error.code }, "Request refused");
      return sendJson(reply.code(422), { error: error.code });
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
    errorReport.tell(request, correlationId);
    if (wantsJson(request)) {
      return sendJson(reply.code(500), { error: "Internal", correlationId });
    }
    // The administrator has been told and the log has the cause. What the
    // reader can add is what neither can hold: what they were doing. The
    // message is a link and not a form because the site has nowhere to keep a
    // reply and the reader's own mail program already knows who they are.
    const speaking = speakingOf(request);
    const subject = speaking.say("errors.messageSubject", {
      reference: correlationId,
      siteName: siteNameOf(request),
    });
    const body = speaking.say("errors.messageBody");
    const message = `mailto:${administrator}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return sendPage(
      reply.code(500),
      assets,
      request,
      "errors.failed",
      "errors.reference",
      { reference: correlationId },
      `
          <p>${escape(speaking.say("errors.recorded"))}</p>
          <p><a href="${escape(message)}">${escape(speaking.say("errors.message"))}</a></p>`,
    );
  });
};
