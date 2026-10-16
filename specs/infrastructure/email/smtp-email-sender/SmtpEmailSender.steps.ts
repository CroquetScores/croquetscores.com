import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { createServer, type AddressInfo } from "node:net";
import { fileURLToPath } from "node:url";

import { simpleParser, type ParsedMail } from "mailparser";
import { SMTPServer } from "smtp-server";

import type { EmailSender } from "../../../../src/application/services/EmailSender.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { SmtpEmailSender } from "../../../../src/infrastructure/email/SmtpEmailSender.js";
import type { SpecWorld } from "../../../support/world.js";

// What a scenario has: the mail server it sends to, the sender, what the
// server took, and how the last send ended. Kept here rather than on the world,
// which may name nothing from infrastructure.
interface Sending {
  server: MailServer | undefined;
  sender: EmailSender | undefined;
  failure: Error | undefined;
  password: string;
}

interface MailServer {
  close: () => Promise<void>;
  port: number;
  readonly received: ParsedMail[];
  readonly signedInAs: string[];
  refused: { address: string; said: string } | undefined;
}

const sendings = new WeakMap<SpecWorld, Sending>();

const sendingOf = (world: SpecWorld): Sending => {
  let sending = sendings.get(world);
  if (sending === undefined) {
    sending = {
      server: undefined,
      sender: undefined,
      failure: undefined,
      password: "",
    };
    sendings.set(world, sending);
  }
  return sending;
};

const serverOf = (world: SpecWorld): MailServer => {
  const server = sendingOf(world).server;
  assert.ok(server !== undefined, "There is no mail server.");
  return server;
};

// A certificate made only for these scenarios, for "localhost", which the
// sender is told to trust. Nothing the site is deployed with.
const here = (name: string): string =>
  fileURLToPath(new URL(name, import.meta.url));
const certificate = (): Promise<string> => readFile(here("cert.pem"), "utf8");
const privateKey = (): Promise<string> => readFile(here("key.pem"), "utf8");

const USER_NAME = "site-user";
const PASSWORD = "the-right-password";
const REFUSAL = "550 No such mailbox here";

const startServer = async (encrypts: boolean): Promise<MailServer> => {
  const received: ParsedMail[] = [];
  const signedInAs: string[] = [];
  const state: MailServer = {
    close: () => Promise.resolve(),
    port: 0,
    received,
    signedInAs,
    refused: undefined,
  };
  const server = new SMTPServer({
    key: await privateKey(),
    cert: await certificate(),
    // Without STARTTLS the server cannot encrypt, which is the whole of what
    // the scenario that uses it needs; it still offers to sign in, so that a
    // sender that did not insist on encryption would be signed in to.
    disabledCommands: encrypts ? [] : ["STARTTLS"],
    allowInsecureAuth: !encrypts,
    authMethods: ["PLAIN", "LOGIN"],
    onAuth(auth, _session, done) {
      if (auth.username === USER_NAME && auth.password === PASSWORD) {
        signedInAs.push(auth.username);
        done(null, { user: auth.username });
      } else {
        done(new Error("Invalid login"));
      }
    },
    onRcptTo(address, _session, done) {
      if (state.refused?.address === address.address) {
        const refusal = Object.assign(new Error(state.refused.said), {
          responseCode: 550,
        });
        done(refusal);
      } else {
        done();
      }
    },
    onData(stream, _session, done) {
      simpleParser(stream).then(
        (mail) => {
          received.push(mail);
          done();
        },
        (error: Error) => {
          done(error);
        },
      );
    },
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  state.port = (server.server.address() as AddressInfo).port;
  state.close = () =>
    new Promise<void>((resolve) => server.close(() => resolve()));
  return state;
};

const sendTo = async (
  world: SpecWorld,
  to: string,
  what: { from?: string; subject?: string; body?: string } = {},
): Promise<void> => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  const sending = sendingOf(world);
  assert.ok(sending.sender !== undefined, "There is no SMTP email sender.");
  try {
    await sending.sender.send(
      {
        to,
        from: what.from ?? "croquetscores@example.com",
        subject: what.subject ?? "An email",
        body: what.body ?? "<p>An email.</p>",
      },
      ReadOnlyDate.from(world.moment),
    );
  } catch (error) {
    sending.failure = error as Error;
  }
};

const theEmail = (world: SpecWorld): ParsedMail => {
  const sending = sendingOf(world);
  assert.equal(
    sending.failure,
    undefined,
    `Sending failed: ${sending.failure?.message ?? ""}`,
  );
  const received = serverOf(world).received;
  assert.equal(received.length, 1, `The server took ${received.length}.`);
  return received[0]!;
};

const addressesOf = (field: ParsedMail["to"]): string[] =>
  [field ?? []].flat().flatMap((group) => group.value.map((a) => a.address!));

// The mail server ------------------------------------------------------------

Given(
  "a mail server that encrypts its connections",
  async function (this: SpecWorld) {
    sendingOf(this).server = await startServer(true);
  },
);

Given(
  "a mail server that does not encrypt its connections",
  async function (this: SpecWorld) {
    const sending = sendingOf(this);
    await sending.server?.close();
    sending.server = await startServer(false);
  },
);

Given(
  "a mail server that refuses the address {string}",
  function (this: SpecWorld, address: string) {
    serverOf(this).refused = { address, said: REFUSAL };
  },
);

// The sender ---------------------------------------------------------------

const senderFor = async (
  world: SpecWorld,
  port: number,
  password: string,
): Promise<void> => {
  const sending = sendingOf(world);
  sending.password = password;
  sending.sender = new SmtpEmailSender({
    host: "localhost",
    port,
    userName: USER_NAME,
    password,
    certificateAuthority: await certificate(),
  });
};

Given(
  "an SMTP email sender signing in with the right user name and password",
  async function (this: SpecWorld) {
    await senderFor(this, serverOf(this).port, PASSWORD);
  },
);

Given(
  "an SMTP email sender signing in with the wrong password",
  async function (this: SpecWorld) {
    await senderFor(this, serverOf(this).port, "the-wrong-password");
  },
);

Given(
  "an SMTP email sender whose server cannot be reached",
  async function (this: SpecWorld) {
    // A port that was free a moment ago and has nothing listening now.
    const port = await new Promise<number>((resolve) => {
      const probe = createServer();
      probe.listen(0, "127.0.0.1", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });
    await senderFor(this, port, PASSWORD);
  },
);

After(async function (this: SpecWorld) {
  await sendings.get(this)?.server?.close();
});

// Sending ----------------------------------------------------------------------

When(
  "an email to {string} is sent through the server",
  async function (this: SpecWorld, to: string) {
    await sendTo(this, to);
  },
);

When(
  "an email to {string} is sent from {string} through the server",
  async function (this: SpecWorld, to: string, from: string) {
    await sendTo(this, to, { from });
  },
);

When(
  "an email to {string} is sent with the subject {string} through the server",
  async function (this: SpecWorld, to: string, subject: string) {
    await sendTo(this, to, { subject });
  },
);

When(
  "an email to {string} is sent with the body {string} through the server",
  async function (this: SpecWorld, to: string, body: string) {
    await sendTo(this, to, { body });
  },
);

// What the server took -----------------------------------------------------------

Then(
  "the server has received {int} email(s)",
  function (this: SpecWorld, count: number) {
    assert.equal(serverOf(this).received.length, count);
  },
);

Then("the email is to {string}", function (this: SpecWorld, to: string) {
  assert.deepEqual(addressesOf(theEmail(this).to), [to]);
});

Then("the email is from {string}", function (this: SpecWorld, from: string) {
  assert.deepEqual(addressesOf(theEmail(this).from), [from]);
});

Then(
  "the email's subject is {string}",
  function (this: SpecWorld, subject: string) {
    assert.equal(theEmail(this).subject, subject);
  },
);

Then("the email's HTML is {string}", function (this: SpecWorld, html: string) {
  assert.equal(String(theEmail(this).html).trim(), html);
});

Then(
  "the server was signed in to as the user name",
  function (this: SpecWorld) {
    assert.deepEqual(serverOf(this).signedInAs, [USER_NAME]);
  },
);

// How sending ended --------------------------------------------------------------

const failureOf = (world: SpecWorld): Error => {
  const failure = sendingOf(world).failure;
  assert.ok(failure !== undefined, "Sending did not fail.");
  return failure;
};

Then("sending fails", function (this: SpecWorld) {
  failureOf(this);
});

Then(
  "the failure's message does not hold the password",
  function (this: SpecWorld) {
    assert.ok(
      !failureOf(this).message.includes(sendingOf(this).password),
      "The failure's message holds the password.",
    );
  },
);

Then(
  "the failure's message holds what the server said",
  function (this: SpecWorld) {
    assert.ok(
      failureOf(this).message.includes(REFUSAL.replace(/^\d+ /, "")),
      `The failure says: ${failureOf(this).message}`,
    );
  },
);
