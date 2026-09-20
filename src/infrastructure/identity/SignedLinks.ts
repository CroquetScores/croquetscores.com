// The links the site emails, signed rather than kept.
//
// A link carries what it is for, which account, and when it stops working,
// with a signature over all three made with the site's token signing key. So
// there is no table of links sent: nothing to look in when one is followed,
// nothing to clear out once they have expired, and every link sent for an
// account goes on working until it expires or is used up, whichever email it
// came in.
//
// What it is for is signed with the rest, so that a link the site made for
// setting a new password is not taken for one to confirm an address, however
// it is sent.
//
// Nothing here says whether a link has expired. Reading one answers what it
// carries, the moment it stops working included, and comparing that moment
// against the one a request was asked for is the request's to do: nothing
// below the web layer reads a clock.
import { createHmac, timingSafeEqual } from "node:crypto";

import type {
  LinkCarried,
  LinkPurpose,
  Links,
} from "../../application/services/Links.js";
import { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** Where each kind of link is followed. */
const pages: Readonly<Record<LinkPurpose, string>> = {
  "confirm-email-address": "/account/confirm-email-address",
  "set-new-password": "/account/set-new-password",
  "confirm-forgetting": "/account/forget-account",
};

const purposes = new Set<string>(Object.keys(pages));

const isAPurpose = (given: string): given is LinkPurpose => purposes.has(given);

const encode = (text: string): string =>
  Buffer.from(text, "utf8").toString("base64url");

const decode = (encoded: string): string =>
  Buffer.from(encoded, "base64url").toString("utf8");

// A signature is the 32 bytes of an HMAC-SHA256 written in base64url, which is
// exactly 43 characters and no padding. Anything else is refused before it is
// decoded, because decoding drops whatever is outside the alphabet: a
// signature with rubbish on the end would otherwise decode to the same bytes
// and hold, and one link would have several spellings that all work. Nothing
// counts links by the text of them today, and the moment anything does — a
// link used once, a limit on how often one is followed — several spellings of
// one link would each be counted as its own.
const isASignature = (given: string): boolean =>
  /^[A-Za-z0-9_-]{43}$/.test(given);

/**
 * The part of `link` that was signed. Whatever the reader followed may be a
 * whole address, the query on its own, or just what was carried, and
 * everything around it is how it got here.
 *
 * The query is read by name rather than by looking for "link=" in the text,
 * so that a parameter whose name merely ends in it — a "deeplink" put there
 * by whatever forwarded the mail — is not taken for the link itself. Given
 * twice there is no saying which was meant, so neither is taken.
 */
const carriedBy = (link: string): string | undefined => {
  const query = link.indexOf("?");
  const given = new URLSearchParams(
    query === -1 ? link : link.slice(query + 1),
  ).getAll("link");
  if (given.length > 1) return undefined;
  if (given.length === 1) return given[0];
  // No link parameter: what was followed is what was carried, unless it had a
  // query, in which case it is an address of ours with the link left off.
  return query === -1 ? link : undefined;
};

export class SignedLinks implements Links {
  /**
   * @param siteAddress where the site answers, as the config says and never a
   *   request's host: a link made from a host is a link anybody can point at
   *   their own site.
   * @param signingKey the site's token signing key.
   */
  constructor(
    private readonly siteAddress: string,
    private readonly signingKey: string,
  ) {}

  make(purpose: LinkPurpose, account: AccountId, until: ReadOnlyDate): string {
    // The moment in milliseconds since the epoch: one number, in no timezone,
    // which is what a link should carry rather than a spelling of a date that
    // whoever reads it back has to agree with.
    const carried = encode(
      `${purpose}.${account.value}.${until.toDate().getTime()}`,
    );
    return `${this.siteAddress}${pages[purpose]}?link=${carried}.${this.sign(carried)}`;
  }

  read(link: string): LinkCarried | undefined {
    const carried = carriedBy(link);
    if (carried === undefined) return undefined;

    // Two parts and no more. Read as the first two of however many, anything
    // after a second dot would be ignored rather than refused, and a link
    // would again have more than one spelling that works.
    const parts = carried.split(".");
    if (parts.length !== 2) return undefined;
    const [body, signature] = parts;
    if (body === undefined || signature === undefined) return undefined;
    if (!isASignature(signature)) return undefined;
    if (!this.holds(body, signature)) return undefined;

    const [purpose, account, until] = decode(body).split(".");
    if (purpose === undefined || account === undefined || until === undefined) {
      return undefined;
    }
    if (!isAPurpose(purpose)) return undefined;
    const moment = Number(until);
    if (!Number.isSafeInteger(moment)) return undefined;

    try {
      return {
        purpose,
        account: AccountId.from(account),
        worksUntil: ReadOnlyDate.from(new Date(moment)),
      };
    } catch {
      // An id the link carried that is not an account's is a link nobody here
      // made, whatever its signature says, and is no more readable than one
      // that was never signed.
      return undefined;
    }
  }

  private holds(body: string, signature: string): boolean {
    const expected = Buffer.from(this.sign(body), "base64url");
    const given = Buffer.from(signature, "base64url");
    // Compared in a time that does not depend on how much of it matches, so
    // that guessing a signature one character at a time gets nowhere.
    return expected.length === given.length && timingSafeEqual(expected, given);
  }

  private sign(carried: string): string {
    return createHmac("sha256", this.signingKey)
      .update(carried)
      .digest("base64url");
  }
}
