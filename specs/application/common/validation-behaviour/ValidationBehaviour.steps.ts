import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ValidationBehaviour } from "../../../../src/application/common/ValidationBehaviour.js";
import type { Range } from "../../../support/exampleRange.js";
import {
  askedAt,
  attempt,
  ExampleCommand,
  ExampleCommandValidator,
  ExampleQuery,
  ExampleQueryValidator,
  mediatorOf,
  validationOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

const rangeOf = (world: SpecWorld): Range => {
  assert.ok(world.range !== undefined, "No example range has been given.");
  return world.range;
};

const registeringAnother = (world: SpecWorld, register: () => void): void => {
  try {
    register();
  } catch (failure) {
    world.failure = failure;
  }
};

// Putting it together ----------------------------------------------------

// The one behaviour stands in both lines, as it does in the application.
Given("a mediator whose requests are validated", function (this: SpecWorld) {
  const behaviour = new ValidationBehaviour();
  this.validation = behaviour;
  mediatorOf(this).addCommandBehaviour(behaviour);
  mediatorOf(this).addQueryBehaviour(behaviour);
});

Given(
  "a validator registered for the example command",
  function (this: SpecWorld) {
    validationOf(this).register(new ExampleCommandValidator());
  },
);

Given(
  "a validator registered for the example query",
  function (this: SpecWorld) {
    validationOf(this).register(new ExampleQueryValidator());
  },
);

When(
  "another validator is registered for the example command",
  function (this: SpecWorld) {
    registeringAnother(this, () =>
      validationOf(this).register(new ExampleCommandValidator()),
    );
  },
);

When(
  "another validator is registered for the example query",
  function (this: SpecWorld) {
    registeringAnother(this, () =>
      validationOf(this).register(new ExampleQueryValidator()),
    );
  },
);

// Handing requests in ----------------------------------------------------

When(
  "the example command is sent for the example range",
  async function (this: SpecWorld) {
    // Carrying whatever else the scenario said the command carries, as the
    // step that sends one without a range does. A scenario that said nothing
    // carries nothing, so this reads the same as it always did; one that set a
    // password can now ask for a range as well, which is what it takes to say
    // that a command breaking its own rules never has its password looked at.
    const command = new ExampleCommand(
      askedAt,
      rangeOf(this),
      undefined,
      this.exampleCommandCarries,
    );
    await attempt(this, () => mediatorOf(this).send(command));
  },
);

When(
  "the example query is asked for the example range",
  async function (this: SpecWorld) {
    const query = new ExampleQuery(rangeOf(this));
    await attempt(this, () => mediatorOf(this).query(query));
  },
);
