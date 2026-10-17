import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { QueuedEmail } from "../../../../src/infrastructure/email/PostgresEmailQueue.js";
import type { SpecWorld } from "../../../support/world.js";
import { registerFor } from "../../support/accounts.js";
import {
  emailsOf,
  nowOf,
  queueAsARequest,
  queueingOf,
} from "../../support/emailQueue.js";

// The command a scenario sends: what it queues, and whether it fails once it
// has queued it.
interface Command {
  kind: string;
  to: string;
  fails: boolean;
}

const commands = new WeakMap<SpecWorld, Command>();

const theEmail = async (world: SpecWorld): Promise<QueuedEmail> => {
  const emails = await emailsOf(world);
  assert.equal(emails.length, 1, `The queue holds ${emails.length} emails.`);
  const email = emails[0];
  assert.ok(email !== undefined);
  return email;
};

const sendAt = async (world: SpecWorld, at: ReadOnlyDate): Promise<void> => {
  await queueingOf(world).queue.sendDue(at);
};

// The queue ------------------------------------------------------------------

Given("an email queue", function (this: SpecWorld) {
  queueingOf(this);
});

Given(
  "a command that queues the email {string} for {string}",
  function (this: SpecWorld, kind: string, to: string) {
    commands.set(this, { kind, to, fails: false });
  },
);

Given("the command fails after queueing it", function (this: SpecWorld) {
  const command = commands.get(this);
  assert.ok(command !== undefined, "There is no command.");
  command.fails = true;
});

When("the command is sent", async function (this: SpecWorld) {
  const command = commands.get(this);
  assert.ok(command !== undefined, "There is no command.");
  const { queue } = queueingOf(this);
  try {
    await this.asARequest(async () => {
      await queue.queue({
        kind: command.kind,
        to: command.to,
        language: "en",
        website: "croquetscores.com",
        fill: {},
        queuedAt: nowOf(this),
      });
      if (command.fails) throw new Error("The command failed after queueing.");
    });
  } catch (failure) {
    this.failure = failure;
  }
});

// Queueing ---------------------------------------------------------------------

Given(
  "the email {string} has been queued for {string}",
  async function (this: SpecWorld, kind: string, to: string) {
    await queueAsARequest(this, { kind, to });
  },
);

Given(
  "the email {string} is queued for {string} in {string}",
  async function (this: SpecWorld, kind: string, to: string, language: string) {
    await queueAsARequest(this, { kind, to, language });
  },
);

Given(
  "the email {string} is queued for {string} with the link {string}",
  async function (this: SpecWorld, kind: string, to: string, link: string) {
    await queueAsARequest(this, { kind, to, fill: { link } });
  },
);

Given(
  "the email {string} is queued for {string} at {string}",
  async function (this: SpecWorld, kind: string, to: string, at: string) {
    await queueAsARequest(this, {
      kind,
      to,
      queuedAt: ReadOnlyDate.from(new Date(at)),
    });
  },
);

Given(
  "the email {string} is queued for {string} at {string} with a link that works until {string}",
  async function (
    this: SpecWorld,
    kind: string,
    to: string,
    at: string,
    until: string,
  ) {
    await queueAsARequest(this, {
      kind,
      to,
      queuedAt: ReadOnlyDate.from(new Date(at)),
      linkWorksUntil: ReadOnlyDate.from(new Date(until)),
      fill: { link: "https://croquetscores.com/a-link" },
    });
  },
);

// Each numbered in what fills it in, in the order it was queued, so that the
// order it is listed or written in can be read off it. Each is queued as a
// request of its own, at the scenario's one moment, as two requests in the
// same instant would queue them.
const numbered = "number";
const queuedInOrder = new WeakMap<SpecWorld, readonly string[]>();

Given(
  "{int} emails have been queued for {string}, one after another, due at the same moment",
  async function (this: SpecWorld, count: number, to: string) {
    const numbers: string[] = [];
    for (let each = 1; each <= count; each++) {
      const number = String(each);
      await queueAsARequest(this, {
        kind: "Email.ConfirmAddress",
        to,
        fill: { [numbered]: number },
      });
      numbers.push(number);
    }
    queuedInOrder.set(this, numbers);
  },
);

const listed = new WeakMap<SpecWorld, readonly QueuedEmail[]>();

When("what is queued is listed", async function (this: SpecWorld) {
  listed.set(this, await emailsOf(this));
});

const inTheOrderQueued = (world: SpecWorld): readonly string[] => {
  const numbers = queuedInOrder.get(world);
  assert.ok(numbers !== undefined, "Nothing was queued one after another.");
  return numbers;
};

Then(
  "the emails are listed in the order they were queued",
  function (this: SpecWorld) {
    const emails = listed.get(this);
    assert.ok(emails !== undefined, "Nothing was listed.");
    assert.deepEqual(
      emails.map((email) => email.fill?.[numbered]),
      inTheOrderQueued(this),
    );
  },
);

// By the order the writer was asked to write them in: each is written as it
// is sent, one after another, so the two orders are the same.
Then(
  "the emails were sent in the order they were queued",
  function (this: SpecWorld) {
    const { sender, writer } = queueingOf(this);
    assert.equal(
      sender.sent.length,
      inTheOrderQueued(this).length,
      `${sender.sent.length} emails were sent.`,
    );
    assert.deepEqual(
      writer.asked.map((email) => email.fill[numbered]),
      inTheOrderQueued(this),
    );
  },
);

Given("an account for {string}", async function (this: SpecWorld, to: string) {
  await registerFor(this, to);
});

Given(
  "what is kept of the email has been altered in the database",
  async function (this: SpecWorld) {
    const { rows } = await this.database.query<{ id: string; sealed: string }>(
      `select id, sealed from email_queue`,
    );
    const row = rows[0];
    assert.ok(
      rows.length === 1 && row !== undefined,
      `The queue holds ${rows.length} emails, not the one to alter.`,
    );
    // One character of what was sealed, changed to another.
    const at = row.sealed.length - 5;
    const changed = row.sealed[at] === "A" ? "B" : "A";
    await this.database.query(
      `update email_queue set sealed = $2 where id = $1`,
      [row.id, row.sealed.slice(0, at) + changed + row.sealed.slice(at + 1)],
    );
  },
);

Then(
  "the email {string} is queued for {string}",
  async function (this: SpecWorld, kind: string, to: string) {
    const waiting = (await emailsOf(this)).filter(
      (email) => !email.givenUp && email.kind === kind && email.to === to,
    );
    assert.equal(waiting.length, 1, `${kind} is not queued for ${to}.`);
  },
);

Then(
  "the email {string} is not queued for {string}",
  async function (this: SpecWorld, kind: string, to: string) {
    const waiting = (await emailsOf(this)).filter(
      (email) => !email.givenUp && email.kind === kind && email.to === to,
    );
    assert.equal(waiting.length, 0, `${kind} is queued for ${to}.`);
  },
);

Then(
  "the queue holds {int} email(s)",
  async function (this: SpecWorld, count: number) {
    const { rows } = await this.database.query(`select id from email_queue`);
    assert.equal(rows.length, count);
  },
);

Then(
  "no row of the queue contains {string}",
  async function (this: SpecWorld, words: string) {
    const { rows } = await this.database.query<{ row: string }>(
      `select t::text as row from email_queue t`,
    );
    assert.ok(rows.length > 0, "The queue holds nothing.");
    for (const { row } of rows) {
      assert.ok(!row.includes(words), `A row holds it: ${row}`);
    }
  },
);

// Sending ------------------------------------------------------------------------

Given("sending will fail", function (this: SpecWorld) {
  queueingOf(this).sender.failing = true;
});

Given("sending will succeed", function (this: SpecWorld) {
  queueingOf(this).sender.failing = false;
});

Given("the writer cannot write it", function (this: SpecWorld) {
  queueingOf(this).writer.cannot = true;
});

When("what is queued is sent", async function (this: SpecWorld) {
  await sendAt(this, nowOf(this));
});

When(
  "what is queued is sent at {string}",
  async function (this: SpecWorld, at: string) {
    await sendAt(this, ReadOnlyDate.from(new Date(at)));
  },
);

When(
  "what is queued is sent by two senders at once",
  async function (this: SpecWorld) {
    const { queue } = queueingOf(this);
    await Promise.all([queue.sendDue(nowOf(this)), queue.sendDue(nowOf(this))]);
  },
);

When(
  "sending the email has been tried {int} times, each as soon as it was due",
  async function (this: SpecWorld, times: number) {
    for (let tried = 0; tried < times; tried++) {
      const email = await theEmail(this);
      assert.ok(!email.givenUp, `It was given up after ${tried} tries.`);
      await sendAt(this, ReadOnlyDate.from(email.dueAt));
    }
  },
);

Then(
  "{string} was sent {int} email(s)",
  function (this: SpecWorld, to: string, count: number) {
    const sent = queueingOf(this).sender.sent.filter(
      (email) => email.to === to,
    );
    assert.equal(sent.length, count);
  },
);

Then(
  "sending the email to {string} has been tried {int} time(s)",
  async function (this: SpecWorld, to: string, times: number) {
    const email = await theEmail(this);
    assert.equal(email.to, to);
    assert.equal(email.tries, times);
  },
);

// Without the address, for an email nothing can read, which has none to name.
Then(
  "sending the email has been tried {int} time(s)",
  async function (this: SpecWorld, times: number) {
    const email = await theEmail(this);
    assert.equal(email.tries, times);
  },
);

Then(
  "the email is due again {int} minute(s) after it last failed",
  async function (this: SpecWorld, minutes: number) {
    const email = await theEmail(this);
    assert.ok(email.lastTriedAt !== undefined, "It has not been tried.");
    assert.equal(
      email.dueAt.getTime() - email.lastTriedAt.getTime(),
      minutes * 60_000,
    );
  },
);

Then(
  "the email {string} for {string} is given up",
  async function (this: SpecWorld, kind: string, to: string) {
    const givenUp = (await emailsOf(this)).filter(
      (email) => email.givenUp && email.kind === kind && email.to === to,
    );
    assert.equal(givenUp.length, 1, `${kind} for ${to} is not given up.`);
  },
);

// The writer -------------------------------------------------------------------

Then(
  "the writer was asked to write {string}",
  function (this: SpecWorld, kind: string) {
    const asked = queueingOf(this).writer.asked.map((email) => email.kind);
    assert.ok(
      asked.includes(kind),
      `The writer was asked for ${asked.join()}.`,
    );
  },
);

Then(
  "the writer was asked to write it in {string}",
  function (this: SpecWorld, language: string) {
    const asked = queueingOf(this).writer.asked.map((email) => email.language);
    assert.ok(asked.includes(language), `It was asked in ${asked.join()}.`);
  },
);

Then(
  "the writer was given the link {string}",
  function (this: SpecWorld, link: string) {
    const given = queueingOf(this).writer.asked.map((email) => email.fill.link);
    assert.ok(given.includes(link), `It was given ${given.join()}.`);
  },
);

Then(
  "the email sent to {string} has the subject the writer wrote",
  function (this: SpecWorld, to: string) {
    const { sender, writer } = queueingOf(this);
    const sent = sender.sent.find((email) => email.to === to);
    assert.ok(sent !== undefined, `Nothing was sent to ${to}.`);
    assert.equal(sent.subject, writer.wrote[0]?.subject);
  },
);

Then(
  "the email sent to {string} has the body the writer wrote",
  function (this: SpecWorld, to: string) {
    const { sender, writer } = queueingOf(this);
    const sent = sender.sent.find((email) => email.to === to);
    assert.ok(sent !== undefined, `Nothing was sent to ${to}.`);
    assert.equal(sent.body, writer.wrote[0]?.body);
  },
);
