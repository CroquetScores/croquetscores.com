/** A key made, and the hash of it that is all the site keeps. */
export interface MadeApiKey {
  /** What the app sends. Shown once to whoever made it, and kept nowhere. */
  readonly key: string;
  /** What is kept of it, and what a key sent is looked up by. */
  readonly hash: string;
}

/**
 * What the application wants of the place keys are made and hashed.
 *
 * A key is a long random secret, so its hash needs no salt and no slow
 * hashing, as a password's does: there is nothing to guess and nothing to
 * look up in a list of likely keys. That is also what lets a key sent be
 * found by its hash alone, which a salted hash would not allow.
 */
export interface ApiKeys {
  /** A new key, unlike any made before, with its hash. */
  make(): MadeApiKey;

  /** The hash of `key`, as it was made. */
  hash(key: string): string;
}
