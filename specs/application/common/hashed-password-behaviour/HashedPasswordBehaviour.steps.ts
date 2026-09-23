import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { HashedPasswordBehaviour } from "../../../../src/application/common/HashedPasswordBehaviour.js";
import { hashOfPasswordSetBy } from "../../../../src/application/common/SetsPassword.js";
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../../../src/application/services/PasswordHasher.js";
import { mediatorOf } from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

/** What the hasher in hand makes of a password, and what a scenario reads back. */
const hashOf = (password: string): string => `hash of ${password}`;

/**
 * The hasher the scenarios put in front of the mediator.
 *
 * It stands in for the site's own, which is slow on purpose and whose hashes
 * are nobody's to predict. What a hash is worth, and what it costs, is
 * specified with the hasher; what is specified here is only where the hashing
 * happens. So this answers at once, and makes a hash a scenario can recognise.
 *
 * It records every password it was asked to hash, so that a scenario can say
 * what was hashed and what was never looked at, and it says as it is asked, so
 * that the order of events can be read.
 */
class HasherInHand implements PasswordHasher {
  readonly hashed: string[] = [];

  constructor(private readonly world: SpecWorld) {}

  hash(password: string): Promise<string> {
    this.hashed.push(password);
    this.world.happened.push("the password is hashed");
    return Promise.resolve(hashOf(password));
  }

  check(): Promise<PasswordCheck> {
    // Nothing in front of a transaction checks a password against a hash:
    // checking one needs the hash already kept, which needs the database.
    throw new Error("Nothing here checks a password against a hash.");
  }
}

const hashers = new WeakMap<SpecWorld, HasherInHand>();

const hasherOf = (world: SpecWorld): HasherInHand => {
  const hasher = hashers.get(world);
  assert.ok(hasher !== undefined, "This scenario's passwords are not hashed.");
  return hasher;
};

/**
 * What the handler found where the hash of the password its command sets goes,
 * read at the moment it was called.
 *
 * Read then rather than afterwards, because what is being said is that the
 * handler was given the hash: a hash made on the way out, after the handler
 * had done its work and the transaction had closed, would still be there to
 * find once the command came back.
 */
const handedOver = new WeakMap<SpecWorld, { hash: string | undefined }>();

const heldBy = (request: unknown): string | undefined => {
  if (typeof request !== "object" || request === null) return undefined;
  try {
    return hashOfPasswordSetBy(request).made;
  } catch {
    // A command that sets no password carries nowhere to put a hash, and one
    // nothing has hashed carries an empty place: both are "no hash here", which
    // is what a scenario asking is asking about.
    return undefined;
  }
};

// Putting it together ----------------------------------------------------

// The hashing stands in the command's line alone, since nothing a query does
// sets a password. It is added before anything else a scenario adds, so that a
// scenario naming a transaction behind it is naming what comes after.
Given(
  "a mediator whose commands' passwords are hashed",
  function (this: SpecWorld) {
    const hasher = new HasherInHand(this);
    hashers.set(this, hasher);
    const handed: { hash: string | undefined } = { hash: undefined };
    handedOver.set(this, handed);
    // The example handler reads what it was given as it runs, which is what
    // lets a scenario say the hash was there by then. The handler has already
    // written down the command it was called with by the time this runs.
    this.whatTheExampleHandlerAlsoDoes.push(() => {
      handed.hash = heldBy(this.handledRequests.at(-1));
      return Promise.resolve();
    });
    mediatorOf(this).addCommandBehaviour(new HashedPasswordBehaviour(hasher));
  },
);

// What was hashed, and what the handler was given ---------------------------

Then(
  "the handler was given a hash of {string}",
  function (this: SpecWorld, password: string) {
    const handed = handedOver.get(this);
    assert.ok(
      handed !== undefined,
      "This scenario's passwords are not hashed.",
    );
    assert.equal(handed.hash, hashOf(password));
  },
);

Then(
  "the password hashed was {string}",
  function (this: SpecWorld, password: string) {
    assert.deepEqual(hasherOf(this).hashed, [password]);
  },
);

Then("no password was hashed", function (this: SpecWorld) {
  assert.deepEqual(hasherOf(this).hashed, []);
});
