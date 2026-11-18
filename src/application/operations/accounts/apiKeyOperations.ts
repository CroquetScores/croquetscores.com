// What making, revoking, listing, identifying and changing the limits of a
// key share: where a key is found by its hash and by its id, and the refusal
// of the one operation an administrator asks for.
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Refused } from "../../../domain/common/Refused.js";

/** Why changing the limits of a key is refused. */
export type ApiKeyOperationErrorCode = "ChangeApiKeyLimits.NoSuchApiKey";

/**
 * An operation's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class ApiKeyOperationRefused extends Refused<ApiKeyOperationErrorCode> {}

/** Which account a key belongs to, and which key a string is. */
export interface FindsApiKeys {
  /**
   * The account and the key id of the key hashing to `hash`, or nothing where
   * no key does. Revoked keys and forgotten accounts' are found by nothing,
   * so that a key that no longer works never has to be asked about.
   */
  findByHash(
    hash: string,
  ): Promise<
    { readonly account: AccountId; readonly keyId: string } | undefined
  >;

  /** The account the key `keyId` belongs to, or nothing where there is none. */
  accountOf(keyId: string): Promise<AccountId | undefined>;
}
