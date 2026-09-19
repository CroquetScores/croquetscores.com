// An email address hashed with HMAC-SHA-256, keyed with the setting
// ACCOUNT_EMAIL_ADDRESS_HASH_KEY, in the one form addresses are compared in.
import { createHmac } from "node:crypto";

import type { EmailAddressHasher } from "../../application/services/EmailAddressHasher.js";
import type { EmailAddress } from "../../domain/aggregates/accounts/value-objects/EmailAddress.js";

export class KeyedEmailAddressHasher implements EmailAddressHasher {
  constructor(private readonly key: string) {}

  hash(address: EmailAddress): string {
    return createHmac("sha256", this.key)
      .update(address.comparable)
      .digest("hex");
  }
}
