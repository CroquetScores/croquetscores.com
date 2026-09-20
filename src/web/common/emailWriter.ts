// The site's emails, written from the catalogue of the language each is to be
// written in, as the site's pages are. The email queue asks for them as it
// sends: it holds no words, and knows only what it asks of a writer, which the
// application declares. This answers it, and server.ts hands it to the queue.
import type {
  EmailToWrite,
  EmailWriter,
  WrittenEmail,
} from "../../application/services/EmailWriter.js";
import { speakingIn, type Language, type Speaking } from "./language.js";
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

// What an email is made of, in the order it is read: paragraphs, and links to
// follow. A link is to what fills the email in, or to one of the site's own
// pages; either is offered as a button in the email's words and again as the
// address itself, for a reader whose mail shows no buttons.
type Block =
  | { readonly paragraph: string }
  | {
      readonly button: string;
      readonly to: { readonly fill: string } | { readonly page: string };
    };

const emails: Readonly<Record<string, readonly Block[]>> = {
  "Email.ConfirmAddress": [
    { paragraph: "intro" },
    { button: "action", to: { fill: "link" } },
    { paragraph: "expiry" },
    { paragraph: "notYou" },
  ],
  "Email.ConfirmAddressAgain": [
    { paragraph: "intro" },
    { button: "action", to: { fill: "link" } },
    { paragraph: "expiry" },
    { paragraph: "registeredAgain" },
    { paragraph: "notYou" },
  ],
  "Email.AlreadyRegistered": [
    { paragraph: "intro" },
    { paragraph: "ifYou" },
    { button: "action", to: { page: "/account/sign-in" } },
    { paragraph: "forgotten" },
    { button: "forgottenAction", to: { page: "/account/forgot-password" } },
    { paragraph: "notYou" },
  ],
  "Email.SetNewPassword": [
    { paragraph: "intro" },
    { button: "action", to: { fill: "link" } },
    { paragraph: "expiry" },
    { paragraph: "signsOut" },
    { paragraph: "notYou" },
  ],
  "Email.RegisterInstead": [
    { paragraph: "intro" },
    { paragraph: "otherAddress" },
    { paragraph: "register" },
    { button: "action", to: { page: "/account/register" } },
    { paragraph: "notYou" },
  ],
  "Email.ConfirmForgetting": [
    { paragraph: "intro" },
    { button: "action", to: { fill: "link" } },
    { paragraph: "meaning" },
    { paragraph: "expiry" },
    { paragraph: "notYou" },
  ],
  "Email.RegistrationsSuspended": [
    { paragraph: "intro" },
    { paragraph: "lifting" },
    { paragraph: "again" },
  ],
};

// What a block says, by the name its words are kept under.
const wordsOf = (block: Block): string =>
  "paragraph" in block ? block.paragraph : block.button;

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

/** Writes the site's emails from `offered`, making links with `address`. */
export const emailWriter = (
  offered: readonly Language[],
  address: string,
): EmailWriter => ({
  write: ({ kind, language, fill }: EmailToWrite): WrittenEmail => {
    const blocks = emails[kind];
    if (blocks === undefined) {
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

    // Every phrase the email is made of, and every link it carries, before a
    // word of it is written: an email with a phrase missing, or with a dead
    // button and an address to copy that is not there, is a mistake in the
    // site, and one that never goes is better than one that does.
    for (const key of [
      `${kind}.subject`,
      "email.signOff",
      "email.linkFallback",
    ].concat(blocks.map((block) => `${kind}.${wordsOf(block)}`))) {
      if (!speaking.knows(key)) {
        throw new EmailWriterRefused(
          "EmailWriter.MissingWords",
          `There are no words for ${key} in ${chosen.tag}, nor in the language the site falls back to.`,
        );
      }
    }
    for (const block of blocks) {
      if ("button" in block && "fill" in block.to && !(block.to.fill in fill)) {
        throw new EmailWriterRefused(
          "EmailWriter.MissingFill",
          `An email of the kind ${kind} carries a ${block.to.fill}, and was given none.`,
        );
      }
    }
    // Filled before it is escaped, so that whatever fills a phrase in is
    // escaped with it and is text wherever it lands, never markup.
    const say = (key: string): string => escape(speaking.say(key, fill));

    const subject = speaking.say(`${kind}.subject`, fill);
    const body = blocks
      .map((block) => write(block, kind, fill, address, say, speaking))
      .join("\n");

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
    <p>${say("email.signOff")}</p>
  </body>
</html>
`,
    };
  },
});

const write = (
  block: Block,
  kind: string,
  fill: Readonly<Record<string, string>>,
  address: string,
  say: (key: string) => string,
  speaking: Speaking,
): string => {
  if ("paragraph" in block)
    return `    <p>${say(`${kind}.${block.paragraph}`)}</p>`;
  const link =
    "fill" in block.to ? (fill[block.to.fill] ?? "") : address + block.to.page;
  // The address to copy is a phrase of its own, with the link filled into it,
  // so that it is text and says itself in the reader's language.
  const copy = escape(speaking.say("email.linkFallback", { link }));
  return `    <p><a href="${escape(link)}">${say(`${kind}.${block.button}`)}</a></p>
    <p>${copy}</p>`;
};
