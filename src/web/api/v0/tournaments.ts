// GET /api/v0/tournaments: a year's tournaments, for apps (tournaments.feature).
// The first read endpoint, which sets what the others copy: what is asked for
// in the address, how a page says where the next is, and how an answer says
// whether it has changed.
import type { FastifyPluginAsync, FastifyReply } from "fastify";

import {
  mostInAPage,
  TournamentsForApps,
  type TournamentsForAppsPage,
} from "../../../application/operations/tournaments/TournamentsForApps.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { websiteOf } from "../../common/site.js";
import { sendConditionally } from "./conditional.js";
import { tournamentHref, uriOf } from "./hrefs.js";
import { refusal } from "./errors.js";
import { refuseKey } from "./apiKey.js";
import { callerOf } from "./rateLimit.js";

interface Asked {
  readonly year?: string;
  readonly sport?: string;
  readonly changedSince?: string;
  readonly page?: string;
  readonly pageSize?: string;
}

// Whole numbers as digits and nothing else, so that "2e3", "0x10" and " 7 " are
// not read as numbers an app never meant.
const wholeNumber = /^-?\d+$/;

// Every refusal of what was asked, written once: the code the application
// refuses it as, and what the API answers. A number too large to be counted is
// refused by the application as not whole, so the route and the application
// are one table and cannot say different things of the same refusal.
const refusals: Readonly<
  Record<
    string,
    { readonly code: string; readonly field: string; readonly message: string }
  >
> = {
  "TournamentsForApps.YearNotWhole": {
    code: "Tournaments.YearNotWhole",
    field: "year",
    message: "The year is a whole number, such as 2026.",
  },
  "TournamentsForApps.YearOutOfRange": {
    code: "Tournaments.YearOutOfRange",
    field: "year",
    message: "No tournament starts in that year.",
  },
  "TournamentsForApps.PageNotWhole": {
    code: "Tournaments.PageNotWhole",
    field: "page",
    message: "The page is a whole number, from 1.",
  },
  "TournamentsForApps.PageOutOfRange": {
    code: "Tournaments.PageOutOfRange",
    field: "page",
    message: "The first page is page 1.",
  },
  "TournamentsForApps.PageSizeNotWhole": {
    code: "Tournaments.PageSizeNotWhole",
    field: "pageSize",
    message: `The page size is a whole number, up to ${String(mostInAPage)}.`,
  },
  "TournamentsForApps.PageSizeOutOfRange": {
    code: "Tournaments.PageSizeOutOfRange",
    field: "pageSize",
    message: "A page holds at least one tournament.",
  },
};

const refusedAs = (reply: FastifyReply, refused: string): FastifyReply => {
  const { code, field, message } = refusals[refused]!;
  return refusal(reply, 400, code, message, field);
};

const refusedAsked = (
  reply: FastifyReply,
  code: string,
  field: string,
  message: string,
): FastifyReply => refusal(reply, 400, code, message, field);

// A moment written out whole, with its zone, since one without is read in the
// server's own and would mean something different where the site is run
// elsewhere. A day there is not, such as the 30th of February, is not a
// moment, which a date that is only parsed would quietly move to March.
const momentOf = (written: string): ReadOnlyDate | undefined => {
  const parts =
    /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/i.exec(
      written,
    );
  if (parts === null) return undefined;
  const [year, month, day] = [
    Number(parts[1]),
    Number(parts[2]),
    Number(parts[3]),
  ];
  const thatDay = new Date(Date.UTC(year, month - 1, day));
  // A day that is not one carries over into another month, as the 30th of
  // February is the 2nd of March.
  if (thatDay.getUTCMonth() !== month - 1) return undefined;
  const moment = Date.parse(written);
  return Number.isNaN(moment) ? undefined : ReadOnlyDate.from(new Date(moment));
};

const said = (page: TournamentsForAppsPage): Record<string, unknown> => ({
  tournaments: page.tournaments.map((each) => ({
    id: each.id,
    name: each.name,
    starts: each.starts,
    finishes: each.finishes,
    country: each.country,
    region: each.region ?? null,
    sport: each.sport,
    uri: uriOf(each.address),
    href: tournamentHref(each.id),
    national: each.national,
    international: each.international,
    changedAt: each.changedAt.toISOString(),
  })),
  total: page.total,
  page: page.page,
  pageSize: page.pageSize,
  next: page.next ?? null,
});

export const tournamentsOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: Asked }>("/tournaments", async (request, reply) => {
    // A key that was sent and does not work is refused, since an app that
    // thinks it is sending one needs to be told it is not. Having none is not
    // refused: reading is for anybody, and a key only says whose allowance.
    const caller = callerOf(request);
    if (caller.carriedKey && caller.key === undefined) {
      return refuseKey(reply, true);
    }

    const { year, sport, changedSince, page, pageSize } = request.query;
    if (year === undefined || year === "") {
      return refusedAsked(
        reply,
        "Tournaments.YearMissing",
        "year",
        "Say which year, as year=2026.",
      );
    }
    if (!wholeNumber.test(year)) {
      return refusedAs(reply, "TournamentsForApps.YearNotWhole");
    }
    if (sport !== undefined && !Sport.all.some((each) => each.code === sport)) {
      return refusedAsked(
        reply,
        "Tournaments.SportUnknown",
        "sport",
        "There is no sport with that code.",
      );
    }
    let since: ReadOnlyDate | undefined;
    if (changedSince !== undefined) {
      since = momentOf(changedSince);
      if (since === undefined) {
        return refusedAsked(
          reply,
          "Tournaments.ChangedSinceNotAMoment",
          "changedSince",
          "changedSince is a moment, written as 2026-03-01T10:00:00Z.",
        );
      }
    }
    if (page !== undefined && !wholeNumber.test(page)) {
      return refusedAs(reply, "TournamentsForApps.PageNotWhole");
    }
    if (pageSize !== undefined && !wholeNumber.test(pageSize)) {
      return refusedAs(reply, "TournamentsForApps.PageSizeNotWhole");
    }

    let answer: TournamentsForAppsPage;
    try {
      answer = await request.server.mediator.query(
        new TournamentsForApps(
          websiteOf(request).host,
          Number(year),
          sport,
          since,
          page === undefined ? 1 : Number(page),
          pageSize === undefined ? mostInAPage : Number(pageSize),
        ),
      );
    } catch (failure) {
      // What was asked was written as whole numbers but is out of the range
      // there is, or too large to be one the site can count.
      const code =
        failure instanceof ValidationError ? String(failure.code) : undefined;
      if (code === undefined || refusals[code] === undefined) throw failure;
      return refusedAs(reply, code);
    }

    // By its mark alone: a list that has lost a tournament has no newer date to
    // say so by, and a date that goes back would have an app keep what is gone.
    // An app asks what changed by `changedSince`.
    return sendConditionally(request, reply, said(answer), answer.changedAt, {
      byDate: false,
    });
  });
  return Promise.resolve();
};
