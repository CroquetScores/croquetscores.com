/** An email to be written: what it is, the language, and what fills it in. */
export interface EmailToWrite {
  /** The kind of email, such as `Email.ConfirmAddress`. */
  readonly kind: string;
  /** The language to write it in, as a tag such as `en`. */
  readonly language: string;
  /** Whatever fills it in, by the name its words give it, such as `link`. */
  readonly fill: Readonly<Record<string, string>>;
}

/** An email once it is written. */
export interface WrittenEmail {
  readonly subject: string;
  /** The body as HTML. */
  readonly body: string;
}

/**
 * What the application wants of whatever writes an email's words.
 *
 * The queue that sends emails knows what an email is and when it goes, and
 * holds no words; it asks this for them as it sends. What an email says is the
 * reader's, kept with every other word the site shows a reader, so this is
 * implemented where those are rather than beside the queue. Writing an email of
 * a kind it has no words for throws.
 */
export interface EmailWriter {
  write(email: EmailToWrite): WrittenEmail;
}
