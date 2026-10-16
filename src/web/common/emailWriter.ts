// The site's emails, written from the catalogue of the language each is to be
// written in, as the site's pages are. The email queue asks for them as it
// sends: it holds no words, and knows only what it asks of a writer, which the
// application declares. This answers it, and server.ts hands it to the queue.
import type {
  EmailToWrite,
  EmailWriter,
  WrittenEmail,
} from "../../application/services/EmailWriter.js";
import { Website } from "../../domain/common/Website.js";
import { Refused } from "../../domain/common/Refused.js";
import { directionAttribute, speakingIn, type Language } from "./language.js";
import { escape } from "./escape.js";
import { siteNameFor } from "./site.js";

/** Every reason writing an email can be refused. */
export type EmailWriterErrorCode =
  | "EmailWriter.UnknownKind"
  | "EmailWriter.MissingWords"
  | "EmailWriter.MissingFill";

export class EmailWriterRefused extends Refused<EmailWriterErrorCode> {}

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

// The kinds of email this writes. Each is two entries in every catalogue,
// `<kind>.subject` and `<kind>.body`, and the body is the whole of the email's
// markup: paragraphs, and links offered both as a button and as the address
// itself, for a reader whose mail shows no buttons. The email is therefore
// read where it is written, and translating one is translating a piece of
// writing rather than assembling one out of phrases. A kind is named here so
// that an email of a kind the site does not send is refused as unknown rather
// than as a catalogue that has lost its words.
const kinds: readonly string[] = [
  "Email.ConfirmAddress",
  "Email.ConfirmAddressAgain",
  "Email.AlreadyRegistered",
  "Email.SetNewPassword",
  "Email.SetPassword",
  "Email.RegisterInstead",
  "Email.ConfirmForgetting",
  "Email.RegistrationsSuspended",
  "Email.DatabaseUnreachable",
  "Email.PasswordChanged",
  "Email.ConfirmNewEmailAddress",
  "Email.AlreadyHasAnAccount",
  "Email.EmailAddressChanged",
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
  /** The name the site's emails are sent from, which each is signed off with. */
  readonly fromName: string;
}

/**
 * Writes the site's emails from `offered`, as `sending` says the site sends.
 * What an email calls the site, and where its links go, are the website it is
 * for: one server sends for every website.
 */
export const emailWriter = (
  offered: readonly Language[],
  { fromName }: SendingEmails,
): EmailWriter => ({
  write: ({ kind, language, website, fill }: EmailToWrite): WrittenEmail => {
    const addressed = Website.from(website);
    const address = addressed.address;
    const siteName = siteNameFor(addressed);
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
      siteName,
    });
    // What the site knows about itself, filled in wherever an email's markup
    // asks for it, and after what the queue gave, so that nothing an email is
    // queued with can paint a button or sign an email as somebody else.
    const body = speaking.say(`${kind}.body`, {
      ...escaped,
      // The website's address, for a link to one of its own pages: it is the
      // website's own and is written into the markup as {site} and a path. It
      // is escaped with the rest, since it lands inside an href.
      site: escape(address),
      buttonBackgroundColour,
      buttonTextColour,
      emailFromName: escape(fromName),
      siteName: escape(siteName),
    });

    return {
      subject,
      body: `<!doctype html>
<html lang="${escape(chosen.tag)}"${directionAttribute(chosen)}>
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
