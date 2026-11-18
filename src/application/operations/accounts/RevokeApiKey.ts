import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Revoking one of the keys of the account the reader is signed in to, named by
 * its id.
 *
 * It names the account the reader is signed in to, never one they chose, and a
 * key of that account: a key of any other is not found, so nothing anybody
 * asks with can revoke another account's key.
 */
export class RevokeApiKey extends Command<AccountId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The key's id, as the list of keys carries it. */
    readonly keyId: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
