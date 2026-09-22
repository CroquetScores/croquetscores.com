import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ConfirmEmailAddress } from "../../../../../src/application/operations/accounts/ConfirmEmailAddress.js";
import { RegisterAccount } from "../../../../../src/application/operations/accounts/RegisterAccount.js";
import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// What a scenario is building, before it is submitted. The request id is
// minted once, so that submitting the same confirmation again submits the same
// id — which is the whole of what "again" means.
interface Building {
  readonly requestId: string;
  link: string;
  name: string;
  password: string;
  passwordConfirmation: string;
}

/** What came of one submission: the code it was refused with, or nothing. */
interface Outcome {
  readonly refusedWith: string | undefined;
}

interface Confirmations {
  building?: Building;
  readonly outcomes: Outcome[];
}

const confirmations = new WeakMap<SpecWorld, Confirmations>();

const theseOf = (world: SpecWorld): Confirmations => {
  let found = confirmations.get(world);
  if (found === undefined) {
    found = { outcomes: [] };
    confirmations.set(world, found);
  }
  return found;
};

// The address the scenario last named, which is the one its emails are queued
// for. On the world rather than here, because other features put an address in
// the scenario's hand too, and a step reading "that email" should find it
// whichever of them did.
const lastAddress = (world: SpecWorld): string => {
  const address = world.addressInHand;
  assert.ok(address !== undefined, "No address has been registered.");
  return address;
};

const beingBuilt = (world: SpecWorld): Building => {
  const { building } = theseOf(world);
  assert.ok(
    building !== undefined,
    "The scenario is building no confirmation.",
  );
  return building;
};

let minted = 0;

// What a confirmation carries when the scenario has not said: a name and a
// password that break no rule, so that a scenario about links stays about
// links.
const build = (world: SpecWorld, link: string): void => {
  minted += 1;
  theseOf(world).building = {
    requestId: `a-confirmation-${minted}`,
    link,
    name: "Sam Someone",
    password: "correct horse battery staple",
    passwordConfirmation: "correct horse battery staple",
  };
};

const commandFor = (
  world: SpecWorld,
  building: Building,
): ConfirmEmailAddress =>
  new ConfirmEmailAddress(
    building.requestId,
    building.link,
    building.name,
    building.password,
    building.passwordConfirmation,
    momentOf(world),
  );

// Submitted, and whatever came of it kept for the scenario to look at rather
// than thrown: most of these scenarios are about how it is refused.
const submit = async (
  world: SpecWorld,
  command: ConfirmEmailAddress,
): Promise<void> => {
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    await registeringOf(world).confirm(command);
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

// What registering left to be confirmed --------------------------------------------

// Registered and its email queued, which is what a confirmation is built from.
// Its own request id, so that registering twice is twice.
Given(
  "a registration for {string} is sent an email",
  async function (this: SpecWorld, address: string) {
    this.addressInHand = address;
    minted += 1;
    await registeringOf(this).send(
      new RegisterAccount(
        `a-registration-${minted}`,
        address,
        "en",
        momentOf(this),
      ),
    );
  },
);

// The link the scenario has hold of --------------------------------------------------

Given("the link in that email is altered", async function (this: SpecWorld) {
  const record = registeringOf(this);
  this.linkInHand = record.altered(
    await record.linkEmailedTo(lastAddress(this)),
  );
});

Given(
  "a link to confirm forgetting the account for {string}",
  async function (this: SpecWorld, address: string) {
    this.linkInHand = await registeringOf(this).aLinkToForget(address);
  },
);

// Building one --------------------------------------------------------------------

Given(
  "a confirmation with the link in that email",
  async function (this: SpecWorld) {
    build(this, await registeringOf(this).linkEmailedTo(lastAddress(this)));
  },
);

Given(
  "a confirmation with the link in the first email",
  async function (this: SpecWorld) {
    build(this, await registeringOf(this).linkEmailedTo(lastAddress(this), 1));
  },
);

Given("a confirmation with that link", function (this: SpecWorld) {
  const link = this.linkInHand;
  assert.ok(link !== undefined, "The scenario has hold of no link.");
  build(this, link);
});

Given("another confirmation with the same link", function (this: SpecWorld) {
  build(this, beingBuilt(this).link);
});

Given("the name given as {string}", function (this: SpecWorld, name: string) {
  beingBuilt(this).name = name;
});

Given(
  "the password given as {string}",
  function (this: SpecWorld, password: string) {
    beingBuilt(this).password = password;
  },
);

Given(
  "the password confirmed as {string}",
  function (this: SpecWorld, password: string) {
    beingBuilt(this).passwordConfirmation = password;
  },
);

// Submitting it ----------------------------------------------------------------------

Given("the confirmation has been submitted", async function (this: SpecWorld) {
  await submit(this, commandFor(this, beingBuilt(this)));
});

When("the confirmation is submitted", async function (this: SpecWorld) {
  await submit(this, commandFor(this, beingBuilt(this)));
});

// The same confirmation, carrying the id it carried the first time: a retry,
// not a second submission.
When(
  "the confirmation is submitted again with the same request id",
  async function (this: SpecWorld) {
    await submit(this, commandFor(this, beingBuilt(this)));
  },
);

// What became of it --------------------------------------------------------------------

Then("the two confirmations answer the same", function (this: SpecWorld) {
  const { outcomes } = theseOf(this);
  assert.equal(outcomes.length, 2, `${outcomes.length} answers came back.`);
  assert.deepEqual(outcomes[0], outcomes[1]);
});

Then(
  "the account for {string} is confirmed",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.confirmed, true, "It is not confirmed.");
  },
);

Then(
  "the account for {string} is called {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.name?.toString(), name);
  },
);

Then(
  "nothing kept for the account contains {string}",
  async function (this: SpecWorld, text: string) {
    const kept = await registeringOf(this).everythingKeptFor(lastAddress(this));
    assert.ok(!kept.includes(text), `What is kept holds ${text}.`);
  },
);
