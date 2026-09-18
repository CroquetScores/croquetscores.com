// The application's password hasher: today's hashes, and the old site's kept
// safe until their passwords are known.
//
// An old hash is never kept as it is. It is imported by hashing it again with
// argon2id at today's cost, and marked, with the account's salt beside it;
// the salt is no secret, and a password cannot be put through the old hasher
// without it. From the moment of the import a guess costs what it costs
// against any other hash.
//
// The mark says which way a hash is checked, and it is checked that way only.
// So a wrong password costs one check whether its account was imported or
// not, and nobody can tell which by timing the answer; and the old hash typed
// in as a password does not match, as it would if an imported hash were tried
// the ordinary way first — which would let anyone holding the old site's
// database sign in to every account in it without working out a password.
//
// An imported hash whose password matches should be made again, and whoever
// keeps it does so, so the old way empties out as readers sign in.
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../application/services/PasswordHasher.js";
import { Argon2id } from "./Argon2id.js";
import { Argon2PasswordHasher } from "./Argon2PasswordHasher.js";
import {
  isOldSalt,
  OldSitePasswordRefused,
  type OldSitePasswordHasher,
} from "./OldSitePasswordHasher.js";

// "$old-site$", then the account's salt, then the argon2id hash of the old
// hash, which begins with a $ of its own. Nothing made today begins this way.
const mark = "$old-site$";
const saltLength = 24;

export class ImportedPasswordHasher implements PasswordHasher {
  readonly #today: Argon2PasswordHasher;

  /**
   * Without the old site's hasher — its site-wide salt not set — an imported
   * hash matches nothing, and importing one is refused. Everything made today
   * works either way.
   */
  constructor(
    private readonly argon2: Argon2id = new Argon2id(),
    private readonly oldSite: OldSitePasswordHasher | undefined = undefined,
  ) {
    this.#today = new Argon2PasswordHasher(argon2);
  }

  hash(password: string): Promise<string> {
    return this.#today.hash(password);
  }

  /** `kept`, as the old site kept it, hashed again and marked as imported. */
  async import(kept: string): Promise<string> {
    if (this.oldSite === undefined) {
      throw new OldSitePasswordRefused("OldSitePassword.SaltMissing");
    }
    const { salt, hash } = this.oldSite.read(kept);
    return `${mark}${salt}${await this.argon2.hash(hash)}`;
  }

  check(password: string, hash: string | undefined): Promise<PasswordCheck> {
    return hash?.startsWith(mark) === true
      ? this.#checkImported(password, hash)
      : this.#today.check(password, hash);
  }

  // The password as the reader typed it, through the old hasher, and the
  // result checked against the argon2id hash of what the old site kept. No
  // accent is taken any differently first: the old site took none.
  async #checkImported(password: string, hash: string): Promise<PasswordCheck> {
    const salt = hash.slice(mark.length, mark.length + saltLength);
    const wrapped = hash.slice(mark.length + saltLength);
    if (this.oldSite === undefined || !isOldSalt(salt)) {
      return { matches: await this.argon2.spend(password), remake: false };
    }
    const matches = await this.argon2.verify(
      wrapped,
      this.oldSite.hashOf(password, salt),
    );
    return { matches, remake: matches };
  }
}
