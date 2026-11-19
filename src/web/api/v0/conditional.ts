// How a read endpoint says whether an answer has changed, which every read
// endpoint does alike (tournaments.feature): a mark of what it said, the date
// it last changed, and nothing but a 304 where the app already has it.
import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

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
  byDate: boolean,
): boolean => {
  const marks = request.headers["if-none-match"];
  if (typeof marks === "string") {
    return marks
      .split(",")
      .map((each) => each.trim().replace(/^W\//, ""))
      .some((each) => each === "*" || each === mark);
  }
  const date = request.headers["if-modified-since"];
  if (byDate && typeof date === "string" && changedAt !== undefined) {
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

/**
 * Sends `said` as JSON with its mark and the date it last changed, or only a
 * 304 where the app has it. Kept by the app that asked and by nobody between,
 * and not used again before the app has asked whether it has changed, which
 * is the whole of what an unchanged answer costs.
 */
export const sendConditionally = (
  request: FastifyRequest,
  reply: FastifyReply,
  said: unknown,
  changedAt: ReadOnlyDate | undefined,
  { byDate = true }: { readonly byDate?: boolean } = {},
): FastifyReply => {
  const body = JSON.stringify(said);
  const mark = markOf(body);
  reply.header("cache-control", "private, no-cache").header("etag", mark);
  if (changedAt !== undefined) {
    reply.header("last-modified", changedAt.toDate().toUTCString());
  }
  if (alreadyHas(request, mark, changedAt, byDate))
    return reply.code(304).send();
  return reply.type("application/json; charset=utf-8").send(body);
};
