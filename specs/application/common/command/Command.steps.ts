import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AccountId } from "../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { ExampleCommand } from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

// The command a scenario made. Kept here rather than on the world, which has
// no business with a command nobody sends.
const made = new WeakMap<SpecWorld, ExampleCommand>();

const commandOf = (world: SpecWorld): ExampleCommand => {
  const command = made.get(world);
  assert.ok(
    command !== undefined,
    `No command was made${world.failure === undefined ? "" : `: ${inspect(world.failure)}`}.`,
  );
  return command;
};

// When the scenario says it was asked for, as the moment step gives it.
const askedAtOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const making = (world: SpecWorld, make: () => ExampleCommand): void => {
  try {
    made.set(world, make());
  } catch (failure) {
    world.failure = failure;
  }
};

// A command that refuses the change by throwing has done what it should, and
// one that ignores it has too: what matters is what it says afterwards.
const tryToChange = (change: () => void): void => {
  try {
    change();
  } catch {
    // Refused, which is one of the two right answers.
  }
};

// Making a command ------------------------------------------------------

// Asked for by the account the scenario named, or by nobody when it named none.
Given("the example command is made", function (this: SpecWorld) {
  making(
    this,
    () => new ExampleCommand(askedAtOf(this), undefined, this.account),
  );
});

When(
  "the example command is made without saying when it was asked for",
  function (this: SpecWorld) {
    making(
      this,
      () =>
        new ExampleCommand(
          undefined as unknown as ReadOnlyDate,
          undefined,
          this.account,
        ),
    );
  },
);

// The cast is the mistake being made: a command written the way commands used
// to be written, with the language's own date, which the compiler catches and a
// call from untyped input would not.
When(
  "the example command is made with a plain date rather than a moment",
  function (this: SpecWorld) {
    const plain = this.moment;
    assert.ok(plain !== undefined, "No moment has been named.");
    making(
      this,
      () =>
        new ExampleCommand(
          plain as unknown as ReadOnlyDate,
          undefined,
          this.account,
        ),
    );
  },
);

When(
  "the example command is made without saying who asked for it",
  function (this: SpecWorld) {
    making(this, () => new ExampleCommand(askedAtOf(this)));
  },
);

// The same mistake with who: an account's id left as the text it came as.
When(
  "the example command is made with an account's id written as text rather than read as one",
  function (this: SpecWorld) {
    making(
      this,
      () =>
        new ExampleCommand(
          askedAtOf(this),
          undefined,
          "account/123e4567-e89b-42d3-a456-426614174000" as unknown as AccountId,
        ),
    );
  },
);

// Trying to change it ---------------------------------------------------

When(
  "who asked for it is changed to {string}",
  function (this: SpecWorld, account: string) {
    const command = commandOf(this) as unknown as { requestedBy: unknown };
    tryToChange(() => {
      command.requestedBy = AccountId.from(account);
    });
  },
);

When(
  "the time it was asked for is changed to {string}",
  function (this: SpecWorld, moment: string) {
    const command = commandOf(this) as unknown as { requestedAt: unknown };
    tryToChange(() => {
      command.requestedAt = ReadOnlyDate.from(new Date(moment));
    });
  },
);

// What came of it --------------------------------------------------------

Then(
  "it was asked for at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(commandOf(this).requestedAt.toISOString(), moment);
  },
);

Then(
  "it was still asked for at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(commandOf(this).requestedAt.toISOString(), moment);
  },
);

Then(
  "it was asked for by {string}",
  function (this: SpecWorld, account: string) {
    assert.equal(commandOf(this).requestedBy?.value, account);
  },
);

Then(
  "it was still asked for by {string}",
  function (this: SpecWorld, account: string) {
    assert.equal(commandOf(this).requestedBy?.value, account);
  },
);

Then("it was asked for by nobody", function (this: SpecWorld) {
  assert.equal(commandOf(this).requestedBy, undefined);
});

Then(
  "making it is refused with {string}",
  function (this: SpecWorld, code: string) {
    const failure = this.failure as { code?: unknown } | undefined;
    assert.ok(failure !== undefined, "The command was made.");
    assert.equal(
      failure.code,
      code,
      `It was refused with ${inspect(failure)}.`,
    );
  },
);
