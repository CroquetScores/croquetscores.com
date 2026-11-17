// A link with what it carries changed and its signature left alone, which is
// what a link somebody has tampered with looks like.
//
// Here because what a link is made of is infrastructure's, and shared because
// two features want one: confirming, and the page a link opens.
//
// What is changed is the moment it stops working, moved ten days back, and the
// rest is left readable: the same purpose, the same account, a moment that is
// still a moment. That is the point of it. Scrambling a character instead would
// leave something that decodes to nothing, and the link would be refused for
// carrying nonsense whether or not its signature was ever looked at — so the
// scenarios would pass against a check that had been taken out.
//
// Back rather than forward, so that the altered link is stale as well as
// altered: one that claimed a later expiry would never be old, and a scenario
// about an altered link being refused whatever its age would pass against a
// check that never looked at its age at all.
import { strict as assert } from "node:assert";

const TEN_DAYS = 10 * 86400000;

export const alterLink = (link: string): string => {
  const [before, carried] = link.split("link=");
  assert.ok(before !== undefined && carried !== undefined, "That is no link.");

  const [body, signature] = carried.split(".");
  assert.ok(
    body !== undefined && signature !== undefined,
    "That link carries nothing.",
  );

  const [purpose, account, until] = Buffer.from(body, "base64url")
    .toString("utf8")
    .split(".");
  assert.ok(
    purpose !== undefined && account !== undefined && until !== undefined,
    "That link carries nothing this can read.",
  );

  const changed = Buffer.from(
    [purpose, account, String(Number(until) - TEN_DAYS)].join("."),
    "utf8",
  ).toString("base64url");
  return `${before}link=${changed}.${signature}`;
};

/**
 * `link` altered to name `account`, with its signature left as it was: what a
 * reader who changed the account in their own link would send. Everything else
 * it carries is left readable, for the reason above.
 */
export const alterLinkToName = (link: string, account: string): string => {
  const [before, carried] = link.split("link=");
  assert.ok(before !== undefined && carried !== undefined, "That is no link.");

  const [body, signature] = carried.split(".");
  assert.ok(
    body !== undefined && signature !== undefined,
    "That link carries nothing.",
  );

  const [purpose, , until] = Buffer.from(body, "base64url")
    .toString("utf8")
    .split(".");
  assert.ok(
    purpose !== undefined && until !== undefined,
    "That link carries nothing this can read.",
  );

  const changed = Buffer.from(
    [purpose, account, until].join("."),
    "utf8",
  ).toString("base64url");
  return `${before}link=${changed}.${signature}`;
};
