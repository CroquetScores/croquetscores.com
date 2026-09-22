import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { BreachedPasswordBehaviour } from "../../../../src/application/common/BreachedPasswordBehaviour.js";
import {
  CheckRefused,
  type BreachedPasswords,
} from "../../../../src/application/services/BreachedPasswords.js";
import {
  carriedByExampleCommand,
  mediatorOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

/**
 * The check the scenarios put in front of the mediator, told by the scenario
 * what has been breached.
 *
 * It stands in for the service the application asks, which the feature cannot
 * name: what asking that service is worth is specified with the check itself,
 * and what is specified here is only where the asking happens. It records
 * every password it was asked about, so that a scenario can say what was
 * checked and what was never looked at, and it says as it is asked, so that
 * the order of events can be read whichever way the answer goes.
 */
class CheckInHand implements BreachedPasswords {
  readonly asked: string[] = [];
  readonly #breached = new Set<string>();
  #reachable = true;

  constructor(private readonly world: SpecWorld) {}

  knows(password: string): void {
    this.#breached.add(password);
  }

  cannotBeReached(): void {
    this.#reachable = false;
  }

  isBreached(password: string): Promise<boolean> {
    this.asked.push(password);
    this.world.happened.push("the password is checked");
    if (!this.#reachable) {
      throw new CheckRefused(
        "BreachedPasswords.Unreachable",
        "The scenario made the service unreachable.",
      );
    }
    return Promise.resolve(this.#breached.has(password));
  }
}

const checks = new WeakMap<SpecWorld, CheckInHand>();

const checkOf = (world: SpecWorld): CheckInHand => {
  const check = checks.get(world);
  assert.ok(check !== undefined, "This scenario's commands are not checked.");
  return check;
};

// Putting it together ----------------------------------------------------

// The check stands in the command's line alone, since nothing a query does
// sets a password. It is added before anything else a scenario adds, so that
// a scenario naming a transaction behind it is naming what comes after.
Given(
  "a mediator whose commands' passwords are checked",
  function (this: SpecWorld) {
    const check = new CheckInHand(this);
    checks.set(this, check);
    // Where the steps that tell a check what has been breached, and make it
    // unreachable, look: they are the check's own steps, and mean the same
    // thing here as they do there.
    this.breachedPasswords = check;
    this.knownBreached = (password) => {
      check.knows(password);
    };
    this.breachedPasswordsUnreachable = () => {
      check.cannotBeReached();
      return Promise.resolve();
    };
    mediatorOf(this).addCommandBehaviour(new BreachedPasswordBehaviour(check));
  },
);

// The command --------------------------------------------------------------

// What the example command carries is said before it is sent, and the command
// itself is made when it is sent: a command is what it was made with, and
// nothing hands one out to be filled in afterwards.
Given("an example command", function (this: SpecWorld) {
  carriedByExampleCommand(this);
});

Given(
  "it sets the password {string}",
  function (this: SpecWorld, password: string) {
    carriedByExampleCommand(this).password = password;
  },
);

Given(
  "it also carries {string} in a field it sets no password from",
  function (this: SpecWorld, text: string) {
    carriedByExampleCommand(this).somethingElse = text;
  },
);

// What was asked about it ---------------------------------------------------

Then(
  "the password checked was {string}",
  function (this: SpecWorld, password: string) {
    assert.deepEqual(checkOf(this).asked, [password]);
  },
);

Then("no password was checked", function (this: SpecWorld) {
  assert.deepEqual(checkOf(this).asked, []);
});
