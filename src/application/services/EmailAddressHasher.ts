import type { EmailAddress } from "../../domain/aggregates/accounts/value-objects/EmailAddress.js";

/**
 * What the application wants of whatever hashes an email address to find an
 * account by.
 *
 * The hash is keyed with a secret of the site's, so that it finds an account
 * and says nothing to anyone without the key: a plain hash of an address can
 * be matched by hashing guesses. The same address, however it was typed,
 * hashes the same, since it is hashed in the one form addresses are compared
 * in.
 */
export interface EmailAddressHasher {
  hash(address: EmailAddress): string;
}
