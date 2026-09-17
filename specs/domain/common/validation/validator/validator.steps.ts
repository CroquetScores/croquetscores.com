import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ValidationError } from "../../../../../src/domain/common/validation/ValidationError.js";
import { Validator } from "../../../../../src/domain/common/validation/Validator.js";
import type { SpecWorld } from "../../../../support/world.js";

// A range exists only to exercise the validator. Its rules mean nothing beyond
// what they show: several rules on one field, a field whose rule is optional,
// and a rule reading two fields.
interface Range {
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;
}

type RangeErrorCode =
  | "Range.StartMissing"
  | "Range.EndMissing"
  | "Range.StartNegative"
  | "Range.StepNotPositive"
  | "Range.StepNotRound"
  | "Range.EndBeforeStart";

const ranges = new Validator<Range, RangeErrorCode>({
  fields: [
    {
      field: "start",
      code: "Range.StartMissing",
      isBrokenBy: (range) => range.start === undefined,
    },
    {
      field: "end",
      code: "Range.EndMissing",
      isBrokenBy: (range) => range.end === undefined,
    },
    {
      field: "start",
      code: "Range.StartNegative",
      isBrokenBy: (range) => range.start !== undefined && range.start < 0,
    },
    {
      field: "step",
      code: "Range.StepNotPositive",
      isBrokenBy: (range) => range.step !== undefined && range.step <= 0,
    },
    {
      field: "step",
      code: "Range.StepNotRound",
      isBrokenBy: (range) => range.step !== undefined && range.step % 5 !== 0,
    },
  ],
  spanning: [
    {
      reads: ["start", "end"],
      code: "Range.EndBeforeStart",
      // Anything it cannot compare counts against it, so that when it says
      // nothing about a missing field it is the validator keeping it quiet.
      isBrokenBy: ({ start, end }) =>
        start === undefined || end === undefined || end < start,
    },
  ],
});

const rangeOf = (world: SpecWorld): Range => {
  assert.ok(world.range !== undefined, "No example range has been given.");
  return world.range;
};

const brokenRulesOf = (world: SpecWorld): readonly string[] => {
  assert.ok(
    world.brokenRules !== undefined,
    "The example range has not been checked.",
  );
  return world.brokenRules;
};

const refusal = (world: SpecWorld): ValidationError => {
  assert.ok(
    world.failure instanceof ValidationError,
    `Expected a validation refusal, and got ${world.failure === undefined ? "nothing" : inspect(world.failure)}.`,
  );
  // instanceof cannot know which codes a generic class was made with, and
  // narrows to any of them; a string is all these steps ask of a code.
  return world.failure as ValidationError<string>;
};

// The candidate ---------------------------------------------------------

Given("an example range", function (this: SpecWorld) {
  this.range = { start: undefined, end: undefined, step: undefined };
});

Given("it starts at {int}", function (this: SpecWorld, start: number) {
  this.range = { ...rangeOf(this), start };
});

Given("it ends at {int}", function (this: SpecWorld, end: number) {
  this.range = { ...rangeOf(this), end };
});

Given("it steps by {int}", function (this: SpecWorld, step: number) {
  this.range = { ...rangeOf(this), step };
});

// Asking the validator --------------------------------------------------

When("the example range is checked", function (this: SpecWorld) {
  this.brokenRules = ranges.check(rangeOf(this));
});

When("the example range is required to be valid", function (this: SpecWorld) {
  try {
    ranges.ensureValid(rangeOf(this));
  } catch (failure) {
    this.failure = failure;
  }
});

// What it answered ------------------------------------------------------

Then("no rule is broken", function (this: SpecWorld) {
  assert.deepEqual(brokenRulesOf(this), []);
});

Then(
  "the first rule broken is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(brokenRulesOf(this)[0], code);
    this.brokenRulesChecked = 1;
  },
);

Then(
  "the next rule broken is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(brokenRulesOf(this)[this.brokenRulesChecked], code);
    this.brokenRulesChecked += 1;
  },
);

Then("no other rule is broken", function (this: SpecWorld) {
  assert.deepEqual(brokenRulesOf(this).slice(this.brokenRulesChecked), []);
});

Then("it is not refused", function (this: SpecWorld) {
  assert.equal(
    this.failure,
    undefined,
    `Expected no refusal, and got ${inspect(this.failure)}.`,
  );
});

Then(
  "it is refused for breaking {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(refusal(this).code, code);
  },
);

Then(
  "the refusal's message is only {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(refusal(this).message, code);
  },
);

Then("the refusal is a validation refusal", function (this: SpecWorld) {
  const refused = refusal(this);
  assert.ok(refused instanceof Error, "The refusal is not an Error.");
  assert.equal(refused.name, "ValidationError");
});
