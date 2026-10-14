import { Refused } from "../../domain/common/Refused.js";

/** Every reason the minutes of a stretch of maintenance can be refused. */
export type DatabaseAccessErrorCode =
  | "DatabaseAccess.MinutesOutOfRange"
  | "DatabaseAccess.MinutesNotWhole"
  | "DatabaseAccess.NotOff"
  | "DatabaseAccess.AlreadyOff";

/** Database access was asked to be what it cannot be (databaseAccess.feature). */
export class DatabaseAccessRefused extends Refused<DatabaseAccessErrorCode> {}

/** The most minutes a stretch of maintenance can be said to be expected for. */
export const MOST_MINUTES_OFF = 1440;

/**
 * Whether the site may use its database, and when it is expected to again.
 * Kept outside the database, since it is the one thing that must be known when
 * the database is not to be asked (FileDatabaseAccess.feature).
 */
export type DatabaseAccessState =
  | { readonly off: false }
  | {
      readonly off: true;
      /** When access was turned off, which moving the return does not change. */
      readonly turnedOffAt: Date;
      /** When it is expected to be on again, as last said. */
      readonly expectedBackAt: Date;
    };

export interface DatabaseAccess {
  /** What it is now, read from where it is kept at most once in a second. */
  current(): Promise<DatabaseAccessState>;

  /**
   * Turns access off at `at`, expected back `minutes` from then, as the whole
   * of what was said before is replaced. Refused as
   * `DatabaseAccess.MinutesNotWhole` or `DatabaseAccess.MinutesOutOfRange`.
   */
  turnOff(minutes: number, at: Date): Promise<void>;

  /**
   * Moves the expected return to `minutes` from `at`, keeping when access was
   * turned off. Refused as above, and as `DatabaseAccess.NotOff` where access
   * is on, since there is no return to move.
   */
  moveReturn(minutes: number, at: Date): Promise<void>;

  /** Turns access on, which is so already if it was not off. */
  turnOn(): Promise<void>;
}
