// What stands behind "an email queue": the Postgres queue on the scenario's
// database, sealing with the key store of the accounts the scenario keeps, and
// a writer and a sender that do as the scenario says and remember what they
// were asked. And the steps the queue's feature and the account keys' feature
// share: queueing an email for an account, and whether anything is queued.
//
// Here rather than in specs/support/ because it names infrastructure, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { EmailToQueue } from "../../../src/application/services/EmailQueue.js";
import type {
  EmailSender,
  OutgoingEmail,
} from "../../../src/application/services/EmailSender.js";
import type {
  EmailToWrite,
  EmailWriter,
  WrittenEmail,
} from "../../../src/application/services/EmailWriter.js";
import type { AccountKeys } from "../../../src/infrastructure/encryption/AccountKeys.js";
import {
  PostgresEmailQueue,
  type QueuedEmail,
} from "../../../src/infrastructure/email/PostgresEmailQueue.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../support/world.js";
import { accountsOf, aSiteKey, keepAccounts, keptAt } from "./accounts.js";
import { unitOfWorkOf } from "./transactions.js";

/** A writer that writes every email by its kind, or cannot write any. */
export class RecordingWriter implements EmailWriter {
  readonly asked: EmailToWrite[] = [];
  readonly wrote: WrittenEmail[] = [];
  cannot = false;

  write(email: EmailToWrite): WrittenEmail {
    this.asked.push(email);
    if (this.cannot) throw new Error("The writer cannot write it.");
    const written = {
      subject: `The subject of ${email.kind}`,
      body: `<p>The body of ${email.kind}, written in ${email.language}.</p>`,
    };
    this.wrote.push(written);
    return written;
  }
}

/** A sender that keeps what it sends, or fails to send anything. */
export class RecordingSender implements EmailSender {
  readonly sent: OutgoingEmail[] = [];
  failing = false;
  /** Where a scenario holds every send up until it lets it go. */
  holdsUntil: Promise<void> | undefined;

  async send(email: OutgoingEmail): Promise<void> {
    if (this.holdsUntil !== undefined) await this.holdsUntil;
    // Long enough that two senders at once are sending at the same time.
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (this.failing) throw new Error("The mail provider did not take it.");
    this.sent.push(email);
  }
}

export interface Queueing {
  queue: PostgresEmailQueue;
  readonly writer: RecordingWriter;
  readonly sender: RecordingSender;
}

const queueings = new WeakMap<SpecWorld, Queueing>();

/** A queue over the scenario's database, sealing with `keys`. */
export const aQueue = (
  world: SpecWorld,
  keys: AccountKeys,
  writer: RecordingWriter,
  sender: RecordingSender,
): PostgresEmailQueue =>
  new PostgresEmailQueue(
    unitOfWorkOf(world),
    keys,
    writer,
    sender,
    "croquetscores@example.com",
  );

/** The scenario's queue, put together the first time anything asks. */
export const queueingOf = (world: SpecWorld): Queueing => {
  let found = queueings.get(world);
  if (found === undefined) {
    let keys: AccountKeys;
    try {
      keys = accountsOf(world).keys;
    } catch {
      keys = keepAccounts(world, aSiteKey()).keys;
    }
    const writer = new RecordingWriter();
    const sender = new RecordingSender();
    found = { queue: aQueue(world, keys, writer, sender), writer, sender };
    queueings.set(world, found);
  }
  return found;
};

/** The moment a scenario means when it names none. */
export const nowOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

/**
 * Queues `email`, as the request a command is sent in would. Queueing that is
 * refused is the scenario's to judge, so it is kept as the failure rather than
 * thrown.
 */
export const queueAsARequest = async (
  world: SpecWorld,
  email: Partial<EmailToQueue> & { kind: string; to: string },
): Promise<void> => {
  const { queue } = queueingOf(world);
  try {
    await world.asARequest(() =>
      queue.queue({
        language: "en",
        website: "croquetscores.com",
        fill: {},
        queuedAt: nowOf(world),
        ...email,
      }),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

/** Every email the queue holds, as it reads them back. */
export const emailsOf = async (
  world: SpecWorld,
): Promise<readonly QueuedEmail[]> => {
  const { queue } = queueingOf(world);
  return world.asARequest(() => queue.emails());
};

// The address the account the scenario kept first was registered at.
const addressOfFirst = (world: SpecWorld): string => {
  const id = keptAt(world, 1);
  for (const [address, ids] of accountsOf(world).byAddress) {
    if (ids.some((each) => each.equals(id))) return address;
  }
  assert.fail("The first account was registered at no address.");
};

When("an email is queued for the account", async function (this: SpecWorld) {
  await queueAsARequest(this, {
    kind: "Email.ConfirmAddress",
    to: addressOfFirst(this),
    account: keptAt(this, 1),
  });
});

When(
  "the email {string} is queued for the account",
  async function (this: SpecWorld, kind: string) {
    await queueAsARequest(this, {
      kind,
      to: addressOfFirst(this),
      account: keptAt(this, 1),
    });
  },
);

When(
  "the email {string} is queued for the account with the link {string}",
  async function (this: SpecWorld, kind: string, link: string) {
    await queueAsARequest(this, {
      kind,
      to: addressOfFirst(this),
      account: keptAt(this, 1),
      fill: { link },
    });
  },
);

Then("nothing is queued to be sent", async function (this: SpecWorld) {
  const waiting = (await emailsOf(this)).filter((email) => !email.givenUp);
  assert.deepEqual(waiting, [], "Something is queued to be sent.");
});

Then(
  "{string} was sent the email {string}",
  function (this: SpecWorld, to: string, kind: string) {
    const { sender } = queueingOf(this);
    const sent = sender.sent.some(
      (email) => email.to === to && email.subject === `The subject of ${kind}`,
    );
    assert.ok(sent, `${to} was not sent ${kind}.`);
  },
);
