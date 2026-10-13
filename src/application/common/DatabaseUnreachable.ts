import { Refused } from "../../domain/common/Refused.js";

/** Every reason the database can be out of reach. */
export type DatabaseUnreachableErrorCode = "Database.Unreachable";

/**
 * The database could not be reached, or was lost while it was being used.
 *
 * It is neither the caller's mistake nor a mistake in how the site was put
 * together, which is why it is not left to be told apart from them by what the
 * driver happened to throw: whatever answers the caller says "unavailable,
 * try again later" for this, and for nothing else. The cause is kept for the
 * log and is never said to a reader, since it names where the database is.
 */
export class DatabaseUnreachable extends Refused<DatabaseUnreachableErrorCode> {
  constructor(cause: unknown) {
    super("Database.Unreachable", "The database could not be reached.", cause);
  }
}
