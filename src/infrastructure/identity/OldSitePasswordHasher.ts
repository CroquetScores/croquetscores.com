// What the old site did to a password, exactly, so that a password can be
// checked against a hash imported from it. Used for nothing else, and goes when
// no imported hash is left.
//
// SHA-1 over the account's own salt — sixteen random bytes — followed by the
// password with a salt shared by the whole site added to its end, written as
// UTF-16 with the low byte first. The salt and the hash were kept together in
// one string of 52 characters: the first 4 characters of the salt in base64,
// then the 28 of the hash, then the other 20 of the salt. The old site did
// nothing to a password before hashing it, so nor does this: no trimming, no
// change of case, and no taking an accent the same however it was typed.
import { createHash, timingSafeEqual } from "node:crypto";
import { Refused } from "../../domain/common/Refused.js";

/** Every reason the old site's hasher can refuse. */
export type OldSitePasswordErrorCode =
  "OldSitePassword.SaltMissing" | "OldSitePassword.Unreadable";

export class OldSitePasswordRefused extends Refused<OldSitePasswordErrorCode> {
  // The code says all there is to say, so it is the message too.
  constructor(code: OldSitePasswordErrorCode) {
    super(code, code);
  }
}

/** An account's salt, and the hash made with it, as the old site kept them. */
export interface OldHash {
  /** Sixteen bytes, in base64: 24 characters. */
  readonly salt: string;
  /** A SHA-1, in base64: 28 characters. */
  readonly hash: string;
}

const saltShape = /^[A-Za-z0-9+/]{22}==$/;
const hashShape = /^[A-Za-z0-9+/]{27}=$/;

/** Whether `salt` is one the old site could have made. */
export const isOldSalt = (salt: string): boolean => saltShape.test(salt);

export class OldSitePasswordHasher {
  readonly #siteSalt: string;

  /**
   * Refused without the site-wide salt, which is a setting and not a
   * constant: without it no old hash can be checked, and a hasher that went on
   * as though it could would match nobody's password without saying why.
   */
  constructor(siteSalt: string | undefined) {
    if (siteSalt === undefined || siteSalt.trim() === "") {
      throw new OldSitePasswordRefused("OldSitePassword.SaltMissing");
    }
    this.#siteSalt = siteSalt;
  }

  /** The salt and hash in a string the old site kept, refused if it could not have. */
  read(kept: string): OldHash {
    const salt = kept.slice(0, 4) + kept.slice(32);
    const hash = kept.slice(4, 32);
    if (kept.length !== 52 || !isOldSalt(salt) || !hashShape.test(hash)) {
      throw new OldSitePasswordRefused("OldSitePassword.Unreadable");
    }
    return { salt, hash };
  }

  /** The hash the old site would have made of `password` with `salt`. */
  hashOf(password: string, salt: string): string {
    return createHash("sha1")
      .update(Buffer.from(salt, "base64"))
      .update(Buffer.from(password + this.#siteSalt, "utf16le"))
      .digest("base64");
  }

  /** Whether `password` is the one the old site made `kept` from. */
  check(password: string, kept: string): boolean {
    const { salt, hash } = this.read(kept);
    return timingSafeEqual(
      Buffer.from(this.hashOf(password, salt)),
      Buffer.from(hash),
    );
  }
}
