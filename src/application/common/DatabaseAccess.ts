import { Refused } from "../../domain/common/Refused.js";

/** Every reason the minutes of a stretch of maintenance can be refused. */
export type DatabaseAccessErrorCode =
  | "DatabaseAccess.MinutesOutOfRange"
  | "DatabaseAccess.MinutesNotWhole"
  | "DatabaseAccess.WordsTooLong"
  | "DatabaseAccess.NotOff"
  | "DatabaseAccess.AlreadyOff";

/** Database access was asked to be what it cannot be (databaseAccess.feature). */
export class DatabaseAccessRefused extends Refused<DatabaseAccessErrorCode> {}

/** The most minutes a stretch of maintenance can be said to be expected for. */
export const MOST_MINUTES_OFF = 1440;

/**
 * The most characters of the words a reader is told while access is off. They
 * are put on every page the site answers, so they are kept to what a sentence
 * or two needs.
 */
export const MOST_WORDS = 500;

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
      /**
       * What a reader is told in place of the usual sentence that the site is
       * down for maintenance, or nothing where the usual sentence is wanted.
       */
      readonly words?: string;
    };

export interface DatabaseAccess {
  /** What it is now, read from where it is kept at most once in a second. */
  current(): Promise<DatabaseAccessState>;

  /**
   * Turns access off at `at`, expected back `minutes` from then, as the whole
   * of what was said before is replaced, with `words` for readers where there
   * are any. Refused as `DatabaseAccess.MinutesNotWhole`,
   * `DatabaseAccess.MinutesOutOfRange` or `DatabaseAccess.WordsTooLong`.
   */
  turnOff(minutes: number, at: Date, words?: string): Promise<void>;

  /**
   * Turns access off as `turnOff` does, but only where it is on, which is
   * decided in one step with the writing and not by asking first: two that
   * begin at once are not both let, and somebody else's maintenance is not
   * replaced. Refused as `DatabaseAccess.AlreadyOff` where it is off.
   */
  turnOffIfOn(minutes: number, at: Date, words?: string): Promise<void>;

  /**
   * Moves the expected return to `minutes` from `at`, keeping when access was
   * turned off. The words are kept as they were where `words` is left out,
   * and replaced where it is given, with none where it is empty. Refused as
   * above, and as `DatabaseAccess.NotOff` where access is on, since there is
   * no return to move.
   */
  moveReturn(minutes: number, at: Date, words?: string): Promise<void>;

  /** Turns access on, which is so already if it was not off. */
  turnOn(): Promise<void>;
}
