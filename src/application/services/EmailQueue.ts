import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** An email to be sent, as it is queued: what it is, and nothing it says. */
export interface EmailToQueue {
  /** The kind of email, such as `Email.ConfirmAddress`. */
  readonly kind: string;
  /** The address it goes to. */
  readonly to: string;
  /**
   * The account it is about, when it is about one: it is kept with the
   * account's key, and is not sent once the account is forgotten.
   */
  readonly account?: AccountId;
  /** The language to write it in, as a tag such as `en`. */
  readonly language: string;
  /** Whatever fills it in, by the name its words give it, such as `link`. */
  readonly fill: Readonly<Record<string, string>>;
  /** When the link it carries stops working, when it carries one. */
  readonly linkWorksUntil?: ReadOnlyDate;
  /** When it was queued, which is when it is first due. */
  readonly queuedAt: ReadOnlyDate;
}

/**
 * What the application wants of the place emails wait to be sent.
 *
 * An email is queued in the transaction of the command it is about, so that
 * it is queued if and only if what it is about is kept. Sending happens
 * outside any request, and is the queue's own business.
 */
export interface EmailQueue {
  queue(email: EmailToQueue): Promise<void>;
}
