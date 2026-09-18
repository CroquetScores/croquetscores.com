import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  RequestInvalid,
  ValidationBehaviour,
} from "../../../../src/application/common/ValidationBehaviour.js";
import { type Range, ranges } from "../../../support/exampleRange.js";
import {
  askedAt,
  attempt,
  ExampleCommand,
  ExampleQuery,
  mediatorOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

// The behaviour a scenario put in the mediator's lines. Kept here rather than
// on the world, which names nothing a single feature alone has any use for.
const behaviours = new WeakMap<SpecWorld, ValidationBehaviour>();

const behaviourOf = (world: SpecWorld): ValidationBehaviour => {
  const behaviour = behaviours.get(world);
  assert.ok(
    behaviour !== undefined,
    "This scenario's requests are not validated.",
  );
  return behaviour;
};

const rangeOf = (world: SpecWorld): Range => {
  assert.ok(world.range !== undefined, "No example range has been given.");
  return world.range;
};

// A refusal for breaking rules says which, and the validator's own steps read
// the rules broken from the world: so what the behaviour refused with is put
// where they look, and "the first rule broken is" means the same thing here as
// it does there.
const handing = async (
  world: SpecWorld,
  hand: () => Promise<unknown>,
): Promise<void> => {
  await attempt(world, hand);
  if (world.failure instanceof RequestInvalid) {
    world.brokenRules = world.failure.broken;
    world.brokenRulesChecked = 0;
  }
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
  behaviours.set(this, behaviour);
  mediatorOf(this).addCommandBehaviour(behaviour);
  mediatorOf(this).addQueryBehaviour(behaviour);
});

// The example requests are ranges in their own right, so the validator's
// example rules are the requests' rules, as they stand.
Given(
  "a validator registered for the example command",
  function (this: SpecWorld) {
    behaviourOf(this).validate(ExampleCommand, ranges);
  },
);

Given(
  "a validator registered for the example query",
  function (this: SpecWorld) {
    behaviourOf(this).validate(ExampleQuery, ranges);
  },
);

When(
  "another validator is registered for the example command",
  function (this: SpecWorld) {
    registeringAnother(this, () =>
      behaviourOf(this).validate(ExampleCommand, ranges),
    );
  },
);

When(
  "another validator is registered for the example query",
  function (this: SpecWorld) {
    registeringAnother(this, () =>
      behaviourOf(this).validate(ExampleQuery, ranges),
    );
  },
);

// Handing requests in ----------------------------------------------------

When(
  "the example command is sent for the example range",
  async function (this: SpecWorld) {
    const command = new ExampleCommand(askedAt, rangeOf(this));
    await handing(this, () => mediatorOf(this).send(command));
  },
);

When(
  "the example query is asked for the example range",
  async function (this: SpecWorld) {
    const query = new ExampleQuery(rangeOf(this));
    await handing(this, () => mediatorOf(this).query(query));
  },
);
