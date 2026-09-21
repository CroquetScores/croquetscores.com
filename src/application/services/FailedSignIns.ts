import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** How many attempts an hour each limit allows. */
export interface MostAnHour {
  readonly byEmailAddress: number;
  readonly byIpAddress: number;
}

/** What came of counting one attempt at signing in. */
export interface SignInAttempt {
  /** Whether one of the limits was already reached, so nothing was tried. */
  readonly held: boolean;
  /** What to forget if the attempt turns out to work. Nothing when held. */
  readonly written: string | undefined;
}

/**
 * A record of the attempts at signing in that failed, kept so that the sign in
 * page cannot be used to guess passwords.
 *
 * An attempt is written down as it is made rather than once it has failed, and
 * forgotten again if it works. Written afterwards, every attempt made at the
 * same moment would count before any of them had been written, each would find
 * the address under its limit, and a limit of ten would stop nobody willing to
 * send eleven at once. Checking a password is slow on purpose, which is
 * exactly how long that gap would be.
 *
 * It counts by email address and by the address the attempt came from. Both
 * are counted whether or not the email address has an account, so that being
 * held says nothing about which addresses exist; the address is counted as it
 * is found — trimmed and in lower case — so that writing it another way does
 * not count afresh.
 */
export interface FailedSignIns {
  /**
   * Counts an attempt at signing in as `emailAddress` from `ipAddress` against
   * both limits, and writes it down — or says it is held, and writes nothing,
   * because an attempt nobody is going to make is not one to count.
   *
   * Counted with the two of them held, so that attempts made at once are
   * counted one after another rather than all of them finding room.
   */
  attempt(
    emailAddress: string,
    ipAddress: string,
    at: ReadOnlyDate,
    mostAnHour: MostAnHour,
  ): Promise<SignInAttempt>;

  /** That the attempt written down as `written` worked, so it counts for nothing. */
  itWorked(written: string): Promise<void>;
}
