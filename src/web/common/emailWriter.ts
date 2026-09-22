// The site's emails, written from the catalogue of the language each is to be
// written in, as the site's pages are. The email queue asks for them as it
// sends: it holds no words, and knows only what it asks of a writer, which the
// application declares. This answers it, and server.ts hands it to the queue.
import type {
  EmailToWrite,
  EmailWriter,
  WrittenEmail,
} from "../../application/services/EmailWriter.js";
import { speakingIn, type Language } from "./language.js";
import { escape } from "./escape.js";

/** Every reason writing an email can be refused. */
export type EmailWriterErrorCode =
  | "EmailWriter.UnknownKind"
  | "EmailWriter.MissingWords"
  | "EmailWriter.MissingFill";

export class EmailWriterRefused extends Error {
  readonly code: EmailWriterErrorCode;

  constructor(code: EmailWriterErrorCode, message: string) {
    super(message);
    this.name = "EmailWriterRefused";
    this.code = code;
  }
}

/**
 * The address the site's links are made with, from how the site is configured
 * and never from a request, whose host is whatever its sender wrote: an email
 * link made from one could be pointed at anybody's site.
 *
 * `https://` and the host the site answers to; `http://` for `localhost` and
 * `127.0.0.1`, which only ever serve development, over plain HTTP; and with no
 * host at all, `http://localhost` and the port the site serves on.
 */
export const siteAddress = (
  canonicalHost: string | undefined,
  port: number,
): string => {
  if (canonicalHost === undefined) return `http://localhost:${port}`;
  const name = canonicalHost.split(":")[0];
  const local = name === "localhost" || name === "127.0.0.1";
  return `${local ? "http" : "https"}://${canonicalHost}`;
};

// The kinds of email this writes. Each is two entries in every catalogue,
// `<kind>.subject` and `<kind>.body`, and the body is the whole of the email's
// markup: paragraphs, and links offered both as a button and as the address
// itself, for a reader whose mail shows no buttons. The email is therefore
// read where it is written, and translating one is translating a piece of
// writing rather than assembling one out of phrases. A kind is named here so
// that an email of a kind the site does not send is refused as unknown rather
// than as a catalogue that has lost its words.
/**
 * What a button in an email is painted with: the site's darker green, and the
 * white read on it — `--action` and `--action-ink` in `assets/site.css`, at
 * their light values.
 *
 * Written out here rather than named, because a mail program reads neither a
 * custom property nor `light-dark()`, and a button whose colours did not
 * arrive would be a line of text where the thing to press should be. The light
 * values are used whatever the reader's own theme, since an email carries no
 * theme to ask about. Kept in step with the stylesheet by hand; `STYLE.md`
 * says what the pairing is for and that it meets WCAG AA.
 */
const buttonBackgroundColour = "#066b00";
const buttonTextColour = "#ffffff";

const kinds: readonly string[] = [
  "Email.ConfirmAddress",
  "Email.ConfirmAddressAgain",
  "Email.AlreadyRegistered",
  "Email.SetNewPassword",
  "Email.RegisterInstead",
  "Email.ConfirmForgetting",
  "Email.RegistrationsSuspended",
];

// The language an email was queued in, as the site offers it: that language, or
// the language it is a regional form of, or the site's first where it offers
// neither, as a browser asking for one is answered.
const languageFor = (
  tag: string,
  offered: readonly Language[],
): Language | undefined => {
  const find = (wanted: string): Language | undefined =>
    offered.find(
      (language) => language.tag.toLowerCase() === wanted.toLowerCase(),
    );
  return find(tag) ?? find(tag.split("-")[0] ?? "") ?? offered[0];
};

/** What the site knows about itself, which every email it writes is given. */
export interface SendingEmails {
  /** The address links to the site's own pages are made with. */
  readonly address: string;
  /** The name the site's emails are sent from, which each is signed off with. */
  readonly fromName: string;
  /** What an email calls the site it comes from, in its subject and its words. */
  readonly fromSite: string;
}

/** Writes the site's emails from `offered`, as `sending` says the site sends. */
export const emailWriter = (
  offered: readonly Language[],
  { address, fromName, fromSite }: SendingEmails,
): EmailWriter => ({
  write: ({ kind, language, fill }: EmailToWrite): WrittenEmail => {
    if (!kinds.includes(kind)) {
      throw new EmailWriterRefused(
        "EmailWriter.UnknownKind",
        `${kind} is not a kind of email this writes.`,
      );
    }
    const chosen = languageFor(language, offered);
    // A writer with no languages at all is a mistake in putting the
    // application together, not an email anybody could have written.
    if (chosen === undefined) {
      throw new Error("The email writer was given no languages to write in.");
    }
    const speaking = speakingIn(chosen, offered);

    // Both of the email's entries, before a word of it is written: an email
    // with no body, or with a subject line saying nothing, is a mistake in the
    // site, and one that never goes is better than one that does.
    for (const key of [`${kind}.subject`, `${kind}.body`]) {
      if (!speaking.knows(key)) {
        throw new EmailWriterRefused(
          "EmailWriter.MissingWords",
          `There are no words for ${key} in ${chosen.tag}, nor in the language the site falls back to.`,
        );
      }
    }
    // The markup as the catalogue holds it, so that what it asks to be filled
    // in can be seen before anything is: an email whose markup carries a link
    // and was given none would go out with a dead button and an address to
    // copy that is not there, which is worse than not going.
    const markup = speaking.say(`${kind}.body`);
    if (markup.includes("{link}") && !("link" in fill)) {
      throw new EmailWriterRefused(
        "EmailWriter.MissingFill",
        `An email of the kind ${kind} carries a link, and was given none.`,
      );
    }

    // Escaped before it is filled in, the other way round from a page, because
    // here the words themselves are markup and are meant to stay markup. Only
    // what fills them in is escaped, so that nothing given to an email — a
    // link, the name of a service — can become markup of its own.
    const escaped = Object.fromEntries(
      Object.entries(fill).map(([name, value]) => [name, escape(value)]),
    );
    // A subject is text wherever it lands, so nothing in it is escaped; the
    // body's markup is where escaping matters.
    const subject = speaking.say(`${kind}.subject`, {
      ...fill,
      emailFromName: fromName,
      emailFromSite: fromSite,
    });
    // What the site knows about itself, filled in wherever an email's markup
    // asks for it, and after what the queue gave, so that nothing an email is
    // queued with can paint a button or sign an email as somebody else.
    const body = speaking.say(`${kind}.body`, {
      ...escaped,
      // The site's address, for a link to one of its own pages: it is the
      // site's own and is written into the markup as {site} and a path.
      site: address,
      buttonBackgroundColour,
      buttonTextColour,
      emailFromName: escape(fromName),
      emailFromSite: escape(fromSite),
    });

    return {
      subject,
      body: `<!doctype html>
<html lang="${escape(chosen.tag)}">
  <head>
    <meta charset="utf-8">
    <title>${escape(subject)}</title>
  </head>
  <body>
${body}
  </body>
</html>
`,
    };
  },
});
