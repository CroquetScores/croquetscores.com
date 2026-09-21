import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { RegisterAccount } from "../../../../../src/application/operations/accounts/RegisterAccount.js";
import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type {
  Registering,
  SeenEmail,
} from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// What a scenario says it is registering with, before it is sent. The request
// id is minted here, once, so that sending the same registration again sends
// the same id — which is the whole of what "again" means.
interface Registration {
  readonly requestId: string;
  readonly address: string;
}

// What came of one registration: the code it was refused with, or nothing when
// it was not. That is the whole of the answer, since registering answers with
// nothing at all — which is itself the point, and what "the two answers are the
// same" is asking about.
interface Outcome {
  readonly refusedWith: string | undefined;
}

interface Registrations {
  readonly written: Registration[];
  readonly outcomes: Outcome[];
}

const registrations = new WeakMap<SpecWorld, Registrations>();

const theseOf = (world: SpecWorld): Registrations => {
  let found = registrations.get(world);
  if (found === undefined) {
    found = { written: [], outcomes: [] };
    registrations.set(world, found);
  }
  return found;
};

const nth = (world: SpecWorld, which: number): Registration => {
  const written = theseOf(world).written[which];
  assert.ok(written !== undefined, `There is no ${which + 1}th registration.`);
  return written;
};

let minted = 0;

const write = (world: SpecWorld, address: string): void => {
  minted += 1;
  theseOf(world).written.push({ requestId: `a-request-${minted}`, address });
};

const commandFor = (world: SpecWorld, written: Registration): RegisterAccount =>
  new RegisterAccount(
    written.requestId,
    written.address,
    "en",
    momentOf(world),
  );

// Sent, and whatever came of it kept for the scenario to look at rather than
// thrown: a refusal is what most of these scenarios are about.
const send = async (world: SpecWorld, written: Registration): Promise<void> => {
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    await registeringOf(world).send(commandFor(world, written));
    theseOf(world).outcomes.push({ refusedWith: undefined });
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { code?: unknown; broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
    theseOf(world).outcomes.push({
      refusedWith:
        typeof refused.code === "string" ? refused.code : inspect(failure),
    });
  }
};

// What is being registered -----------------------------------------------------

Given(
  "a registration for {string}",
  function (this: SpecWorld, address: string) {
    write(this, address);
  },
);

Given(
  "another registration for {string}",
  function (this: SpecWorld, address: string) {
    write(this, address);
  },
);

// What is there already ---------------------------------------------------------

Given(
  "{string} has been registered {int} times in the last hour",
  async function (this: SpecWorld, address: string, times: number) {
    await registeringOf(this).wroteTo(
      address,
      "Email.AlreadyRegistered",
      times,
    );
  },
);

Given(
  "the link has been sent again to {string} {int} times in the last hour",
  async function (this: SpecWorld, address: string, times: number) {
    await registeringOf(this).wroteTo(
      address,
      "Email.ConfirmAddressAgain",
      times,
    );
  },
);

Given("recording the account will fail", function (this: SpecWorld) {
  registeringOf(this).makeRecordingFail();
});

// Making one at all ---------------------------------------------------------------

// Made and not sent: what is refused here is refused before there is anything
// to send, and the shared step reads the refusal from the world.
When("a registration is made with no request id", function (this: SpecWorld) {
  this.failure = undefined;
  try {
    new RegisterAccount("", "someone@example.com", "en", momentOf(this));
  } catch (failure) {
    this.failure = failure;
  }
});

// Sending it ---------------------------------------------------------------------

When("it is sent", async function (this: SpecWorld) {
  await send(this, nth(this, 0));
});

When(
  "it is sent again with the same request id",
  async function (this: SpecWorld) {
    await send(this, nth(this, 0));
  },
);

When(
  "a registration for {string} is sent",
  async function (this: SpecWorld, address: string) {
    write(this, address);
    await send(this, nth(this, theseOf(this).written.length - 1));
  },
);

// All at once, so that each is in a transaction of its own and they race for
// the address. None is allowed to fail the step: which of them is refused,
// and how, is what the scenarios ask about.
const sendAtOnce = async (
  world: SpecWorld,
  commands: RegisterAccount[],
): Promise<void> => {
  const these = theseOf(world);
  const answers = await Promise.allSettled(
    commands.map((command) => registeringOf(world).send(command)),
  );
  for (const answer of answers) {
    const refused = (
      answer.status === "rejected" ? answer.reason : undefined
    ) as { code?: unknown } | undefined;
    these.outcomes.push({
      refusedWith:
        refused === undefined
          ? undefined
          : typeof refused.code === "string"
            ? refused.code
            : inspect(refused),
    });
  }
};

When("the two are sent at once", async function (this: SpecWorld) {
  await sendAtOnce(
    this,
    [nth(this, 0), nth(this, 1)].map((written) => commandFor(this, written)),
  );
});

// Each with a request id of its own, so that none is taken for another sent
// again: what they share is the account they write to, and nothing else.
When(
  "{int} registrations for {string} are sent at once",
  async function (this: SpecWorld, many: number, address: string) {
    const from = theseOf(this).written.length;
    for (let sent = 0; sent < many; sent += 1) {
      write(this, address);
    }
    await sendAtOnce(
      this,
      theseOf(this)
        .written.slice(from)
        .map((written) => commandFor(this, written)),
    );
  },
);

// What became of the account -----------------------------------------------------

Then(
  "there is an account for {string}",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
  },
);

Then(
  "there is no account for {string}",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.equal(account, undefined, `There is an account for ${address}.`);
  },
);

Then(
  "there is one account for {string}",
  async function (this: SpecWorld, address: string) {
    assert.equal(await registeringOf(this).accountsFor(address), 1);
  },
);

Then(
  "the account for {string} is not confirmed",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.confirmed, false);
  },
);

Then(
  "the account for {string} has no name",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.name, undefined);
  },
);

Then(
  "the account for {string} has no password",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.passwordHash, undefined);
  },
);

// An account read back has recorded nothing of its own, and expects its stream
// where the events it was rebuilt from left it: that is how many there are.
Then(
  "the account for {string} has recorded {int} event(s)",
  async function (this: SpecWorld, address: string, events: number) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.expectedVersion, events);
  },
);

// What was queued -----------------------------------------------------------------

const queuedFor = async (
  world: SpecWorld,
  address: string,
): Promise<SeenEmail[]> => {
  const queued = await registeringOf(world).queued();
  return queued.filter((email) => email.to === address);
};

const theOneQueuedFor = async (
  world: SpecWorld,
  address: string,
): Promise<SeenEmail> => {
  const queued = await queuedFor(world, address);
  assert.equal(queued.length, 1, `${queued.length} emails are queued.`);
  const only = queued[0];
  assert.ok(only !== undefined);
  return only;
};

Then(
  "the email queued for {string} carries a link",
  async function (this: SpecWorld, address: string) {
    const email = await theOneQueuedFor(this, address);
    assert.ok(
      email.link !== undefined && email.link !== "",
      "It carries no link.",
    );
  },
);

// Where the email actually points, read from the email as it is written
// rather than from what was queued: a link to a page of this site's is the
// writer's to make, and the kind is what tells it which page.
Then(
  "the email sent to {string} links to {string}",
  async function (this: SpecWorld, address: string, page: string) {
    const written = await registeringOf(this).writtenFor(address);
    assert.ok(
      written.includes(`https://croquetscores.com${page}`),
      `It links nowhere near ${page}.`,
    );
  },
);

// Filled with no link, which is not the same as carrying none: registering
// minted nothing for this email, and the writer makes its buttons itself.
Then(
  "the email queued for {string} is filled with no link",
  async function (this: SpecWorld, address: string) {
    const email = await theOneQueuedFor(this, address);
    assert.equal(
      email.link,
      undefined,
      `It was filled with ${String(email.link)}.`,
    );
  },
);

// An email with no link of its own is not one for the queue to give up on for
// a link's age.
Then(
  "the email queued for {string} never stops working",
  async function (this: SpecWorld, address: string) {
    const email = await theOneQueuedFor(this, address);
    assert.equal(
      email.worksUntil,
      undefined,
      "The queue was told a link's age.",
    );
  },
);

Then(
  "the email queued for {string} stops working at {string}",
  async function (this: SpecWorld, address: string, moment: string) {
    const email = await theOneQueuedFor(this, address);
    assert.ok(email.worksUntil !== undefined, "The queue was not told.");
    assert.equal(
      email.worksUntil.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "{int} emails are queued for {string}",
  async function (this: SpecWorld, count: number, address: string) {
    assert.equal((await queuedFor(this, address)).length, count);
  },
);

Then(
  "one email is queued for {string}",
  async function (this: SpecWorld, address: string) {
    assert.equal((await queuedFor(this, address)).length, 1);
  },
);

const nothingFor = async (world: SpecWorld, address: string): Promise<void> => {
  const queued = await queuedFor(world, address);
  assert.deepEqual(queued, [], `Something is queued for ${address}.`);
};

Then(
  "nothing is queued for {string}",
  async function (this: SpecWorld, address: string) {
    await nothingFor(this, address);
  },
);

Then(
  "nothing more is queued for {string}",
  async function (this: SpecWorld, address: string) {
    await nothingFor(this, address);
  },
);

Then(
  "nothing more is queued to be sent, to any address",
  async function (this: SpecWorld) {
    const queued = await registeringOf(this).queued();
    assert.deepEqual(queued, [], "Something is queued.");
  },
);

// How it answered -------------------------------------------------------------------

const twoOutcomes = (world: SpecWorld): [Outcome, Outcome] => {
  const { outcomes } = theseOf(world);
  assert.equal(outcomes.length, 2, `${outcomes.length} answers came back.`);
  const [first, second] = outcomes;
  assert.ok(first !== undefined && second !== undefined);
  return [first, second];
};

Then("the two answers are the same", function (this: SpecWorld) {
  const [first, second] = twoOutcomes(this);
  assert.deepEqual(first, second);
});

Then("neither of them was refused", function (this: SpecWorld) {
  for (const outcome of twoOutcomes(this)) {
    assert.equal(
      outcome.refusedWith,
      undefined,
      `One was refused with ${String(outcome.refusedWith)}.`,
    );
  }
});

Then("none of them was refused", function (this: SpecWorld) {
  for (const outcome of theseOf(this).outcomes) {
    assert.equal(
      outcome.refusedWith,
      undefined,
      `One was refused with ${String(outcome.refusedWith)}.`,
    );
  }
});

Then("neither answer names {string}", function (this: SpecWorld, code: string) {
  for (const outcome of twoOutcomes(this)) {
    assert.ok(
      outcome.refusedWith === undefined || !outcome.refusedWith.includes(code),
      `An answer names ${code}.`,
    );
  }
});
