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
import { createHmac } from "node:crypto";

import type { LinkPurpose, Links } from "../../application/services/Links.js";
import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** Where each kind of link is followed. */
const pages: Readonly<Record<LinkPurpose, string>> = {
  "confirm-email-address": "/account/confirm-email-address",
  "set-new-password": "/account/set-new-password",
  "confirm-forgetting": "/account/forget-account",
};

const encode = (text: string): string =>
  Buffer.from(text, "utf8").toString("base64url");

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

  private sign(carried: string): string {
    return createHmac("sha256", this.signingKey)
      .update(carried)
      .digest("base64url");
  }
}
