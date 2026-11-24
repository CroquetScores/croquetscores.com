// GET /api/v1/tournaments/changed-year: the tournaments that have come into another
// year than the one they were in, for apps (changedYear.feature). It
// follows the list's conventions (tournaments.ts): what is asked for in the
// address, how a page says where the next is, and how an answer says whether it
// has changed.
import type { FastifyPluginAsync, FastifyReply } from "fastify";

import {
  TournamentsChangedYear,
  type TournamentsChangedYearPage,
} from "../../../application/operations/tournaments/TournamentsChangedYear.js";
import { mostInAPage } from "../../../application/operations/tournaments/TournamentsForApps.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { websiteOf } from "../../common/site.js";
import { refuseKey } from "./apiKey.js";
import { marked, sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { callerOf } from "./rateLimit.js";
import { momentOf, wholeNumber } from "./tournaments.js";

interface Asked {
  readonly changedSince?: string;
  readonly page?: string;
  readonly pageSize?: string;
}

// What the application refuses, said as the list of a year's says the same.
const refusals: Readonly<
  Record<
    string,
    { readonly code: string; readonly field: string; readonly message: string }
  >
> = {
  "TournamentsChangedYear.PageNotWhole": {
    code: "Tournaments.PageNotWhole",
    field: "page",
    message: "The page is a whole number, from 1.",
  },
  "TournamentsChangedYear.PageOutOfRange": {
    code: "Tournaments.PageOutOfRange",
    field: "page",
    message: "The first page is page 1.",
  },
  "TournamentsChangedYear.PageSizeNotWhole": {
    code: "Tournaments.PageSizeNotWhole",
    field: "pageSize",
    message: `The page size is a whole number, up to ${String(mostInAPage)}.`,
  },
  "TournamentsChangedYear.PageSizeOutOfRange": {
    code: "Tournaments.PageSizeOutOfRange",
    field: "pageSize",
    message: "A page holds at least one tournament.",
  },
};

const refusedAs = (reply: FastifyReply, refused: string): FastifyReply => {
  const { code, field, message } = refusals[refused]!;
  return refusal(reply, 400, code, message, field);
};

const said = (page: TournamentsChangedYearPage): Record<string, unknown> => ({
  tournaments: page.tournaments.map((each) =>
    marked({
      tournamentId: each.tournamentId,
      previousYear: each.previousYear,
      newYear: each.newYear,
    }),
  ),
  total: page.total,
  page: page.page,
  pageSize: page.pageSize,
  next: page.next ?? null,
});

export const tournamentsChangedYearOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: Asked }>(
    "/tournaments/changed-year",
    async (request, reply) => {
      // A key that was sent and does not work is refused, and having none is
      // not, as the list's is (tournaments.ts).
      const caller = callerOf(request);
      if (caller.carriedKey && caller.key === undefined) {
        return refuseKey(reply, true);
      }

      const { changedSince, page, pageSize } = request.query;
      let since: ReadOnlyDate | undefined;
      if (changedSince !== undefined) {
        since = momentOf(changedSince);
        if (since === undefined) {
          return refusal(
            reply,
            400,
            "Tournaments.ChangedSinceNotAMoment",
            "changedSince is a moment, written as 2026-03-01T10:00:00Z.",
            "changedSince",
          );
        }
      }
      if (page !== undefined && !wholeNumber.test(page)) {
        return refusedAs(reply, "TournamentsChangedYear.PageNotWhole");
      }
      if (pageSize !== undefined && !wholeNumber.test(pageSize)) {
        return refusedAs(reply, "TournamentsChangedYear.PageSizeNotWhole");
      }

      let answer: TournamentsChangedYearPage;
      try {
        answer = await request.server.mediator.query(
          new TournamentsChangedYear(
            websiteOf(request).host,
            since,
            page === undefined ? 1 : Number(page),
            pageSize === undefined ? mostInAPage : Number(pageSize),
          ),
        );
      } catch (failure) {
        const code =
          failure instanceof ValidationError ? String(failure.code) : undefined;
        if (code === undefined || refusals[code] === undefined) throw failure;
        return refusedAs(reply, code);
      }

      // By its mark alone, as the list of a year's is: a list that has lost a
      // tournament has no newer date to say so by.
      return sendConditionally(request, reply, said(answer), answer.changedAt, {
        byDate: false,
      });
    },
  );
  return Promise.resolve();
};
