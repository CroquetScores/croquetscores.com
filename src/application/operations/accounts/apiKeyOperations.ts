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

/**
 * A key that works, and all that is needed to let a request in on it: who it
 * acts as, what it may do, and the limits it is held to.
 */
export interface ApiKeyFound {
  readonly account: AccountId;
  readonly keyId: string;
  readonly mayRead: boolean;
  readonly mayWrite: boolean;
  /** The id of the one tournament the key is limited to, or nothing for none. */
  readonly tournament: string | undefined;
  readonly perMinute: number;
  readonly perDay: number;
}

/** Which account a key belongs to, and which key a string is. */
export interface FindsApiKeys {
  /**
   * The key hashing to `hash` with what it may do, or nothing where no key
   * does. Revoked keys and forgotten accounts' are found by nothing, and an
   * account that is not confirmed has made none, so what is found works and
   * needs no asking of the account.
   */
  findByHash(hash: string): Promise<ApiKeyFound | undefined>;

  /** The account the key `keyId` belongs to, or nothing where there is none. */
  accountOf(keyId: string): Promise<AccountId | undefined>;

  /** Every key that works, with the account it belongs to, in no order. */
  all(): Promise<
    readonly { readonly account: AccountId; readonly keyId: string }[]
  >;
}
