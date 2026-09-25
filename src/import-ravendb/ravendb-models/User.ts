/**
 * A `User` document as the old sites kept it in RavenDB, as far as importing
 * one reads it. The old sites kept more — a slug, whether it was archived, the
 * key its confirmation link carried, when it last signed in — and none of it
 * has anywhere to go here.
 */
export interface User {
  readonly EmailAddress: string;
  readonly Name: string;
  /**
   * The old site's hash of the password, never the password: the salt and the
   * hash in one string, as `OldSitePasswordHasher` reads it.
   */
  readonly Password: string;
  /**
   * When the user confirmed their email address, as Newtonsoft wrote a
   * `DateTime`: `2013-01-27T00:00:00.0000000`, with no zone. Nothing if they
   * never did.
   */
  readonly ConfirmedAt: string | null;
}
