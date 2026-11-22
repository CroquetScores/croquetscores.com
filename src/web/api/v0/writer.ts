// Who a request that changes something is for (writer.feature). Every route of
// the API that changes something goes by this, so that the website's own pages
// and other people's software call the same routes, and neither has a set of
// its own to keep as the other's changes.
//
// A request that sends a key is judged by the key alone, even where a session
// came with it. A caller that sent one meant to be known by it, and a key that
// does not work mended by whoever happened to be signed in would let a
// leaked or revoked key go on being tried with no one the wiser.
//
// A browser on another website is refused whichever it sends, since a request
// that changes something is refused when it came from somewhere else
// (crossSite.ts). An app that is not a browser page is not.
import type { FastifyReply, FastifyRequest } from "fastify";

import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { readerOf } from "../../common/reader.js";
import { refuseKey } from "./apiKey.js";
import { refusal } from "./errors.js";
import { callerOf } from "./rateLimit.js";

/**
 * The account a request changes things for, or nothing once the request has
 * been answered with why it may not. `tournament` is the id of the one the
 * request is about, where it is about one, which a key made for another
 * tournament may not touch; a request about none, as making a tournament is,
 * is outside what a key made for one tournament may do.
 */
export const writerOf = (
  request: FastifyRequest,
  reply: FastifyReply,
  tournament?: string,
): AccountId | undefined => {
  const { key, carriedKey } = callerOf(request);
  if (carriedKey) {
    if (key === undefined) {
      refuseKey(reply, true);
      return undefined;
    }
    if (!key.mayWrite) {
      refusal(
        reply,
        403,
        "ApiKey.ReadOnly",
        "The API key was made only to read.",
      );
      return undefined;
    }
    if (key.tournament !== undefined && key.tournament !== tournament) {
      refusal(
        reply,
        403,
        "ApiKey.LimitedToAnotherTournament",
        "The API key was made for another tournament.",
      );
      return undefined;
    }
    return AccountId.from(key.account);
  }
  const reader = readerOf(request);
  if (reader === undefined) {
    refuseKey(reply, false);
    return undefined;
  }
  return reader;
};
