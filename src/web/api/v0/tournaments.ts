// GET /api/v0/tournaments: a year's tournaments, for apps (tournaments.feature).
// The first read endpoint, which sets what the others copy: what is asked for
// in the address, how a page says where the next is, and how an answer says
// whether it has changed.
import { createHash } from "node:crypto";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import {
  mostInAPage,
  TournamentsForApps,
  type TournamentsForAppsPage,
} from "../../../application/operations/tournaments/TournamentsForApps.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { websiteOf } from "../../common/site.js";
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

const refusedAsked = (
  reply: FastifyReply,
  code: string,
  field: string,
  message: string,
): FastifyReply => refusal(reply, 400, code, message, field);

// What the answer says, as the answer is, so that two answers are the same
// where what they say is: a mark made from the words and nothing else about
// the request.
const markOf = (said: string): string =>
  `"${createHash("sha256").update(said).digest("base64url").slice(0, 27)}"`;

// Whether the app already has this answer, by the mark it sent, which is
// asked before the date: a mark is exact where a date is only to the second.
const alreadyHas = (
  request: FastifyRequest,
  mark: string,
  changedAt: ReadOnlyDate | undefined,
): boolean => {
  const marks = request.headers["if-none-match"];
  if (typeof marks === "string") {
    return marks
      .split(",")
      .map((each) => each.trim().replace(/^W\//, ""))
      .some((each) => each === "*" || each === mark);
  }
  const date = request.headers["if-modified-since"];
  if (typeof date === "string" && changedAt !== undefined) {
    const since = Date.parse(date);
    // Dates are said to the second, so a change within the second the app
    // was told is not seen by comparing more finely than it was told.
    return (
      Number.isFinite(since) &&
      Math.floor(changedAt.toDate().getTime() / 1000) <=
        Math.floor(since / 1000)
    );
  }
  return false;
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
    address: each.address,
    national: each.national,
    international: each.international,
    changedAt: each.changedAt.toISOString(),
  })),
  total: page.total,
  page: page.page,
  pageSize: page.pageSize,
  next: page.next ?? null,
});

const outOfRange: readonly (readonly [string, string, string, string])[] = [
  [
    "TournamentsForApps.YearOutOfRange",
    "Tournaments.YearOutOfRange",
    "year",
    "No tournament starts in that year.",
  ],
  [
    "TournamentsForApps.PageOutOfRange",
    "Tournaments.PageOutOfRange",
    "page",
    "The first page is page 1.",
  ],
  [
    "TournamentsForApps.PageSizeOutOfRange",
    "Tournaments.PageSizeOutOfRange",
    "pageSize",
    "A page holds at least one tournament.",
  ],
];

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
      return refusedAsked(
        reply,
        "Tournaments.YearNotWhole",
        "year",
        "The year is a whole number, such as 2026.",
      );
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
      const moment = Date.parse(changedSince);
      if (!/^\d{4}-\d{2}-\d{2}T/.test(changedSince) || Number.isNaN(moment)) {
        return refusedAsked(
          reply,
          "Tournaments.ChangedSinceNotAMoment",
          "changedSince",
          "changedSince is a moment, written as 2026-03-01T10:00:00Z.",
        );
      }
      since = ReadOnlyDate.from(new Date(moment));
    }
    if (page !== undefined && !wholeNumber.test(page)) {
      return refusedAsked(
        reply,
        "Tournaments.PageNotWhole",
        "page",
        "The page is a whole number, from 1.",
      );
    }
    if (pageSize !== undefined && !wholeNumber.test(pageSize)) {
      return refusedAsked(
        reply,
        "Tournaments.PageSizeNotWhole",
        "pageSize",
        `The page size is a whole number, up to ${String(mostInAPage)}.`,
      );
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
      // What was asked was whole numbers, but out of the range there is.
      const refused = outOfRange.find(
        ([code]) => failure instanceof ValidationError && failure.code === code,
      );
      if (refused === undefined) throw failure;
      const [, code, field, message] = refused;
      return refusedAsked(reply, code, field, message);
    }

    const body = JSON.stringify(said(answer));
    const mark = markOf(body);
    // Kept by the app that asked and by nobody between, and not used again
    // before the app has asked whether it has changed, which is the whole of
    // what an unchanged answer costs.
    reply.header("cache-control", "private, no-cache").header("etag", mark);
    if (answer.changedAt !== undefined) {
      reply.header("last-modified", answer.changedAt.toDate().toUTCString());
    }
    if (alreadyHas(request, mark, answer.changedAt)) {
      return reply.code(304).send();
    }
    return reply.type("application/json; charset=utf-8").send(body);
  });
  return Promise.resolve();
};
