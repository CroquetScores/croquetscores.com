// Sending an email by writing it to a file, where whoever is working on the
// site can open it in a browser and follow its links. It stands in for a mail
// provider until there is one, and always in development and the scenarios:
// nothing leaves the machine.
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  EmailSender,
  OutgoingEmail,
} from "../../application/services/EmailSender.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

// The most of an address a file's name holds, in bytes. A name may be 255 bytes
// on most file systems and an address 254 on its own, so the whole of one would
// not fit beside the moment and the id; the start of it still says whose it is.
const MOST_ADDRESS_BYTES = 100;

// Whether a file's name can hold `character` on every system it might be
// written on: not the separators, not the characters Windows keeps for itself,
// and nothing that is not printable.
const nameable = (character: string): boolean =>
  !'/\\:*?"<>|'.includes(character) &&
  (character.codePointAt(0) ?? 0) > 0x1f &&
  character !== "";

const escape = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

// The moment in UTC, as 20260919T100000Z, so that the files sort in the order
// they were sent, to the second.
const writtenMoment = (at: ReadOnlyDate): string =>
  at
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "Z");

// The address as a file's name can hold it: every character a name cannot hold
// replaced, and cut to its first bytes between characters, never through one.
const nameableAddress = (address: string): string => {
  let name = "";
  let bytes = 0;
  for (const character of address) {
    const kept = nameable(character) ? character : "_";
    const size = Buffer.byteLength(kept);
    if (bytes + size > MOST_ADDRESS_BYTES) break;
    name += kept;
    bytes += size;
  }
  return name;
};

export class FileEmailSender implements EmailSender {
  constructor(private readonly folder: string) {}

  async send(email: OutgoingEmail, at: ReadOnlyDate): Promise<void> {
    await mkdir(this.folder, { recursive: true });
    const name = `email-${writtenMoment(at)}-${nameableAddress(email.to)}-${randomUUID()}.html`;
    // Who it is to and from, and its subject, are written as text: an address
    // can hold what HTML reads as markup, and a subject is filled in from
    // outside the site, so either could otherwise put a script in a file that
    // runs when it is opened. The body is HTML already, written by the email
    // writer, which makes whatever fills it in text, and goes in as it is.
    const file = `<!doctype html>
<meta charset="utf-8">
<title>${escape(email.subject)}</title>
<dl>
  <dt>To</dt><dd id="to">${escape(email.to)}</dd>
  <dt>From</dt><dd id="from">${escape(email.from)}</dd>
  <dt>Subject</dt><dd id="subject">${escape(email.subject)}</dd>
</dl>
<hr>
${email.body}`;
    // Never over a file already there: the id makes that a file of another
    // email, and one email is not to take another's place.
    await writeFile(join(this.folder, name), file, { flag: "wx" });
  }
}
