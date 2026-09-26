import { Refused } from "../../domain/common/Refused.js";
/** Every way asking about a password can be refused. */
export type BreachedPasswordsErrorCode = "BreachedPasswords.Unreachable";

/**
 * A check that could not be made. Named by a code, because the code is the
 * contract: what an unchecked password means — refusing it, or suspending
 * registering until the service is back — is the caller's to say, and the
 * caller tells this apart from an answer by the code rather than the words.
 */
export class CheckRefused extends Refused<BreachedPasswordsErrorCode> {}

/**
 * What the application wants of the place a password is asked about.
 *
 * Which passwords have appeared in a breach is not something the site can know
 * for itself, so it is asked of an outside service, and the answer is yes, no,
 * or that the service could not be reached: never a guess. Which passwords are
 * allowed otherwise is the password's own rule; this asks about whatever it is
 * given, as the reader meant it rather than as their keyboard spelled it.
 */
export interface BreachedPasswords {
  /**
   * Whether `password` is among those known to have been breached. Throws
   * {@link CheckRefused} when the service could not be reached, so that a
   * password nobody checked is neither allowed nor refused here.
   */
  isBreached(password: string): Promise<boolean>;
}
