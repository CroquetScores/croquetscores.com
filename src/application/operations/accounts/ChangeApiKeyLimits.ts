import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Changing how many requests a key may make a minute and a day, as an
 * administrator does, the key named by its id. It is for raising a limit for
 * one partner without any code changing.
 */
export class ChangeApiKeyLimits extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The key's id, as the list of its account's keys carries it. */
    readonly keyId: string,
    readonly perMinute: number,
    readonly perDay: number,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
