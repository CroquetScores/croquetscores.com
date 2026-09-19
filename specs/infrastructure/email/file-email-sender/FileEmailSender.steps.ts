import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { FileEmailSender } from "../../../../src/infrastructure/email/FileEmailSender.js";
import type { SpecWorld } from "../../../support/world.js";

// What a scenario has: the folder its emails are written to, the sender writing
// there, and the address of the last email it sent. Kept here rather than on
// the world, which may name nothing from infrastructure.
interface Sending {
  folder: string;
  sender: FileEmailSender;
  lastTo?: string;
}

const sendings = new WeakMap<SpecWorld, Sending>();

const sendingOf = (world: SpecWorld): Sending => {
  const sending = sendings.get(world);
  assert.ok(sending !== undefined, "There is no file email sender.");
  return sending;
};

const DOMAIN = "@example.com";

// A well-made address exactly `bytes` long, all of it plain letters before the
// @, so that bytes and characters are the same.
const addressOf = (bytes: number): string =>
  "a".repeat(bytes - DOMAIN.length) + DOMAIN;

const send = async (
  world: SpecWorld,
  to: string,
  what: { subject?: string; body?: string } = {},
): Promise<void> => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  const sending = sendingOf(world);
  sending.lastTo = to;
  await sending.sender.send(
    {
      to,
      from: "croquetscores@example.com",
      subject: what.subject ?? "An email",
      body: what.body ?? "<p>An email.</p>",
    },
    ReadOnlyDate.from(world.moment),
  );
};

const filesOf = async (world: SpecWorld): Promise<string[]> =>
  readdir(sendingOf(world).folder);

const theFileOf = async (world: SpecWorld): Promise<string> => {
  const files = await filesOf(world);
  assert.equal(files.length, 1, `The folder holds ${files.length} files.`);
  return files[0] ?? "";
};

const contentOf = async (world: SpecWorld): Promise<string> =>
  readFile(join(sendingOf(world).folder, await theFileOf(world)), "utf8");

const unescape = (text: string): string =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

// What the file says in one of its headings — who the email is to, or its
// subject — as a reader of the file sees it.
const headingOf = async (world: SpecWorld, id: string): Promise<string> => {
  const found = new RegExp(`<dd id="${id}">([^<]*)</dd>`).exec(
    await contentOf(world),
  );
  assert.ok(found !== null, `The file does not say its ${id}.`);
  return unescape(found[1] ?? "");
};

// The sender ---------------------------------------------------------------

Given(
  "a file email sender writing to a folder of the scenario's own",
  async function (this: SpecWorld) {
    const folder = await mkdtemp(join(tmpdir(), "file-email-sender-"));
    sendings.set(this, { folder, sender: new FileEmailSender(folder) });
  },
);

After(async function (this: SpecWorld) {
  const sending = sendings.get(this);
  if (sending !== undefined) {
    await rm(sending.folder, { recursive: true, force: true });
  }
});

// Sending ----------------------------------------------------------------------

When(
  "an email to {string} is sent",
  async function (this: SpecWorld, to: string) {
    await send(this, to);
  },
);

When(
  "another email to {string} is sent",
  async function (this: SpecWorld, to: string) {
    await send(this, to);
  },
);

When(
  "an email to an address of {int} bytes is sent",
  async function (this: SpecWorld, bytes: number) {
    await send(this, addressOf(bytes));
  },
);

When(
  "an email to {string} with the subject {string} is sent",
  async function (this: SpecWorld, to: string, subject: string) {
    await send(this, to, { subject });
  },
);

When(
  "an email to {string} with the body {string} is sent",
  async function (this: SpecWorld, to: string, body: string) {
    await send(this, to, { body });
  },
);

// The folder and its files ---------------------------------------------------

Then(
  "the folder holds {int} file(s)",
  async function (this: SpecWorld, count: number) {
    assert.equal((await filesOf(this)).length, count);
  },
);

Then(
  "the file's name begins {string}",
  async function (this: SpecWorld, start: string) {
    const name = await theFileOf(this);
    assert.ok(name.startsWith(start), `The file is named ${name}.`);
  },
);

Then(
  "the file's name ends {string}",
  async function (this: SpecWorld, end: string) {
    const name = await theFileOf(this);
    assert.ok(name.endsWith(end), `The file is named ${name}.`);
  },
);

Then(
  "the file's name is no longer than {int} bytes",
  async function (this: SpecWorld, bytes: number) {
    const name = await theFileOf(this);
    assert.ok(
      Buffer.byteLength(name) <= bytes,
      `The file's name is ${Buffer.byteLength(name)} bytes.`,
    );
  },
);

Then(
  "the file says it is to {string}",
  async function (this: SpecWorld, to: string) {
    assert.equal(await headingOf(this, "to"), to);
  },
);

Then(
  "the file says it is to the whole address",
  async function (this: SpecWorld) {
    const to = sendingOf(this).lastTo;
    assert.ok(to !== undefined, "Nothing has been sent.");
    assert.equal(await headingOf(this, "to"), to);
  },
);

Then(
  "the file says its subject is {string}",
  async function (this: SpecWorld, subject: string) {
    assert.equal(await headingOf(this, "subject"), subject);
  },
);

Then(
  "the file holds {string}",
  async function (this: SpecWorld, words: string) {
    const content = await contentOf(this);
    assert.ok(content.includes(words), `The file holds ${content}.`);
  },
);

Then(
  "the file contains no element named {string}",
  async function (this: SpecWorld, name: string) {
    const content = await contentOf(this);
    assert.ok(
      !new RegExp(`<\\s*${name}\\b`, "i").test(content),
      `The file has a ${name} element: ${content}`,
    );
  },
);
