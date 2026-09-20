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
    // Whatever the reader followed, which may be a whole address, the query on
    // its own, or just what was carried: the link is the part that was signed,
    // and everything around it is how it got here.
    const carried = link.includes("link=")
      ? (link.split("link=")[1]?.split("&")[0] ?? "")
      : link;
    const [body, signature] = carried.split(".");
    if (body === undefined || signature === undefined) return undefined;
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
