/** What checking a password against a hash found. */
export interface PasswordCheck {
  /** Whether the password is the one the hash was made from. */
  readonly matches: boolean;
  /**
   * Whether the hash was made some older way and should be made again from
   * the password, now that it is known. Only ever said of a match.
   */
  readonly remake: boolean;
}

/**
 * What the application wants of the place passwords are hashed.
 *
 * A password is never kept, only a hash of it, and nothing here hands a
 * password back or writes one anywhere. Which passwords are allowed is not the
 * hasher's to say; it hashes whatever it is given.
 */
export interface PasswordHasher {
  /** A hash of `password`, made today's way, with a salt of its own. */
  hash(password: string): Promise<string>;

  /**
   * Whether `password` is the one `hash` was made from. No hash, or one
   * nobody can read, matches nothing, and takes as long to say so as checking
   * against a real hash does, so that signing in fails in the same time for
   * an address nobody registered as for a wrong password.
   */
  check(password: string, hash: string | undefined): Promise<PasswordCheck>;
}
