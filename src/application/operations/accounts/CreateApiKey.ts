import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** A key just made: its id, which lists and revoking name it by, and the key. */
export interface CreatedApiKey {
  readonly id: string;
  /** What the app sends. This answer is the only place it is ever shown. */
  readonly key: string;
}

/**
 * Making a key for the account the reader is signed in to, for an app to act
 * with in place of a password.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can make a key for another account.
 */
export class CreateApiKey extends Command<CreatedApiKey> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** What the reader calls it, to tell their keys apart. */
    readonly label: string,
    /** "read" or "read-and-write". */
    readonly scope: string,
    /** The id of the one tournament it is limited to, or nothing for none. */
    readonly tournament: string | undefined,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
