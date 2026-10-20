import { Query } from "../../common/Query.js";
import type { LogEntry } from "../../services/ServerLog.js";

/**
 * The newest entries of the server's log, narrowed to a severity and more
 * severe and to those that mention some text, as an administrator reads them
 * (LogEntries.feature).
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class LogEntries extends Query<readonly LogEntry[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** A severity as the log names it. None asks for every entry. */
    readonly severity?: string,
    /** Text to find. None, or only spaces, asks for none. */
    readonly mentioning?: string,
  ) {
    super();
  }
}
