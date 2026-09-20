// The application's breached password check: Have I Been Pwned's range search,
// which is what lets a password be asked about without leaving the site. The
// password is hashed with SHA-1, the first five characters of the hash are
// sent, and the service answers with the rest of every breached hash that
// begins with them. The check finds its own among those, so the service learns
// only that the password is one of several hundred, and never which.
//
// A password is hashed as its reader meant it rather than as their keyboard
// spelled it, put into the one form (NFC) as the password hasher puts it, so
// that the same password is not found breached one way and clean the other.
import { createHash } from "node:crypto";

import {
  type BreachedPasswords,
  CheckRefused,
} from "../../application/services/BreachedPasswords.js";

/** Where the service answers a range search, with the five characters after it. */
export const pwnedPasswordsRange = "https://api.pwnedpasswords.com/range/";

// A few seconds: long enough for the service on a slow day, and short enough
// that a reader registering is not left waiting on it rather than told to try
// again.
export const defaultWaitMilliseconds = 3000;

// How much of the hash leaves the site. The rest is what the check finds among
// the service's answer.
const SENT = 5;

const asMeant = (password: string): string => password.normalize("NFC");

const sha1Of = (password: string): string =>
  createHash("sha1").update(asMeant(password)).digest("hex").toUpperCase();

// One line of the service's answer: the rest of a breached hash, a colon, and
// how many times it was seen. An answer with any other kind of line in it is
// not the list — a page from a proxy, say — and is not read as one.
const aLineOfTheList = /^[0-9A-F]{35}:\d+$/;

const unreachable = (what: string, cause?: unknown): CheckRefused =>
  new CheckRefused(
    "BreachedPasswords.Unreachable",
    `Have I Been Pwned ${what}, so the password could not be checked.`,
    cause,
  );

export class HaveIBeenPwnedPasswords implements BreachedPasswords {
  constructor(
    private readonly rangeUrl: string = pwnedPasswordsRange,
    private readonly waitMilliseconds: number = defaultWaitMilliseconds,
  ) {}

  async isBreached(password: string): Promise<boolean> {
    const hash = sha1Of(password);
    const rests = await this.restsBeginning(hash.slice(0, SENT));
    return rests.includes(hash.slice(SENT));
  }

  // The rest of every breached hash beginning with `prefix`.
  private async restsBeginning(prefix: string): Promise<readonly string[]> {
    let response: Response;
    let body: string;
    try {
      response = await fetch(`${this.rangeUrl}${prefix}`, {
        signal: AbortSignal.timeout(this.waitMilliseconds),
      });
      if (!response.ok) throw unreachable(`answered ${response.status}`);
      body = await response.text();
    } catch (cause) {
      if (cause instanceof CheckRefused) throw cause;
      throw unreachable(
        "could not be reached, or did not answer in time",
        cause,
      );
    }

    const lines = body.split(/\r?\n/).filter((line) => line !== "");
    // Every five characters begin several hundred breached hashes, so an
    // answer with nothing in it is not the list either: a captive portal or a
    // proxy answering for the service, and not a password nobody has used.
    if (
      lines.length === 0 ||
      !lines.every((line) => aLineOfTheList.test(line))
    ) {
      throw unreachable("answered with something other than a list of hashes");
    }
    // Every line has passed the pattern, so the rest of the hash is exactly
    // what comes before the colon.
    return lines.map((line) => line.slice(0, line.indexOf(":")));
  }
}
