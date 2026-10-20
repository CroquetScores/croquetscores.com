import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Removing the server's log from before the last hour, as an administrator
 * asks for it (PruneLog.feature). Answers how many entries were removed.
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class PruneLog extends Command<number> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
