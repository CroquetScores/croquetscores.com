import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SignInWithFacebook } from "../../../../../src/application/operations/accounts/SignInWithFacebook.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import { identitySaidFor } from "../../../../support/facebook.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";
import { sendAtOnce, toSendAtOnce } from "../signingsInAtOnce.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const commandFor = (world: SpecWorld): SignInWithFacebook => {
  const identity = identitySaidFor(world);
  return new SignInWithFacebook(
    identity.facebookId,
    identity.emailAddress,
    identity.name,
    momentOf(world),
  );
};

Given(
  "the next signing in with Facebook looks for its Facebook account before it is linked",
  function (this: SpecWorld) {
    registeringOf(this).lookForFacebookAccountTooEarly();
  },
);

Given(
  "the next signing in with Facebook finds its account before it is forgotten",
  function (this: SpecWorld) {
    registeringOf(this).forgetAccountOnceFoundByFacebook();
  },
);

// Whatever came of it is kept for the scenario rather than thrown, as signing
// in with a password keeps it: some of these scenarios are about how it is
// refused.
When("signing in with Facebook is sent", async function (this: SpecWorld) {
  this.answer = undefined;
  this.failure = undefined;
  try {
    this.answer = await registeringOf(this).signInWithFacebook(
      commandFor(this),
    );
  } catch (failure) {
    this.failure = failure;
  }
});

When(
  "{int} signings in with Facebook are sent at once",
  async function (this: SpecWorld, many: number) {
    const registering = registeringOf(this);
    for (let each = 0; each < many; each++) {
      toSendAtOnce(this, () =>
        registering.signInWithFacebook(commandFor(this)),
      );
    }
    await sendAtOnce(this);
  },
);

Given(
  "{int} signings in with Facebook",
  function (this: SpecWorld, many: number) {
    const registering = registeringOf(this);
    for (let each = 0; each < many; each++) {
      toSendAtOnce(this, () =>
        registering.signInWithFacebook(commandFor(this)),
      );
    }
  },
);

// Something the scenario builds on, so a refusal here is a scenario that is
// wrong about what it is standing on, and is thrown.
Given(
  "signing in with Facebook has been sent",
  async function (this: SpecWorld) {
    await registeringOf(this).signInWithFacebook(commandFor(this));
  },
);

const accountFor = async (world: SpecWorld, address: string) => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account;
};

// Whether an account is linked is asked as anything else would ask it: by
// linking, on the account as it was read, which is never saved. The Facebook
// account it is linked to already records nothing, and linking one to an
// account linked to none records it.
Then(
  "the account for {string} is linked to the Facebook account {string}",
  async function (this: SpecWorld, address: string, facebookId: string) {
    const account = await accountFor(this, address);
    account.linkFacebookAccount(facebookId, momentOf(this));
    assert.equal(account.recorded.length, 0, "It was linked to none.");
  },
);

Then(
  "the account for {string} is linked to no Facebook account",
  async function (this: SpecWorld, address: string) {
    const account = await accountFor(this, address);
    account.linkFacebookAccount(
      "a-facebook-account-never-seen",
      momentOf(this),
    );
    assert.equal(account.recorded.length, 1);
  },
);
