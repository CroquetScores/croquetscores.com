import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** An email once it is written, ready to go. */
export interface OutgoingEmail {
  /** The address it goes to, as it was given. */
  readonly to: string;
  /** The address it comes from: the site's own. */
  readonly from: string;
  readonly subject: string;
  /** The body as HTML. */
  readonly body: string;
}

/**
 * What the application wants of whatever takes an email the rest of the way.
 *
 * It is told the moment the email is sent at rather than reading a clock,
 * since nothing below the web layer reads one. Sending that fails throws, and
 * the email is tried again later.
 */
export interface EmailSender {
  send(email: OutgoingEmail, at: ReadOnlyDate): Promise<void>;
}
