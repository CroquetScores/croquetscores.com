import { createHash, randomBytes } from "node:crypto";

import type {
  ApiKeys,
  MadeApiKey,
} from "../../application/services/ApiKeys.js";

/**
 * Keys of 32 random bytes, 256 bits, written so that they can go in a header
 * unchanged, and hashed with SHA-256. The prefix tells whoever finds one in a
 * log or a repository whose it is, so that it can be revoked.
 */
export class CryptoApiKeys implements ApiKeys {
  make(): MadeApiKey {
    const key = `cs_${randomBytes(32).toString("base64url")}`;
    return { key, hash: this.hash(key) };
  }

  hash(key: string): string {
    return createHash("sha256").update(key).digest("hex");
  }
}
