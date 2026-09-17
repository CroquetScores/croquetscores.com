import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";

const momentOf = (world: SpecWorld): Date => {
  assert.ok(world.moment !== undefined, "No moment has been given.");
  return world.moment;
};

const lastDateOf = (world: SpecWorld): ReadOnlyDate => {
  const last = world.readOnlyDates.at(-1);
  assert.ok(
    last !== undefined,
    `No read-only date has been made: ${inspect(world.failure)}`,
  );
  return last;
};

const twoDatesOf = (world: SpecWorld): [ReadOnlyDate, ReadOnlyDate] => {
  const [first, second] = world.readOnlyDates;
  assert.ok(
    first !== undefined && second !== undefined,
    `Expected two read-only dates, and there are ${world.readOnlyDates.length}.`,
  );
  return [first, second];
};

// The moment -------------------------------------------------------------

Given("the moment {string}", function (this: SpecWorld, moment: string) {
  this.moment = new Date(moment);
});

Given("a moment that cannot be read", function (this: SpecWorld) {
  this.moment = new Date("not a moment");
});

// Making read-only dates -------------------------------------------------

When("a read-only date is made from it", function (this: SpecWorld) {
  try {
    this.readOnlyDates.push(ReadOnlyDate.from(momentOf(this)));
  } catch (failure) {
    this.failure = failure;
  }
});

Given("a read-only date made from it", function (this: SpecWorld) {
  this.readOnlyDates.push(ReadOnlyDate.from(momentOf(this)));
});

Given("another read-only date made from it", function (this: SpecWorld) {
  this.readOnlyDates.push(ReadOnlyDate.from(momentOf(this)));
});

Given(
  "another read-only date made from {string}",
  function (this: SpecWorld, moment: string) {
    this.readOnlyDates.push(ReadOnlyDate.from(new Date(moment)));
  },
);

// Trying to move it ------------------------------------------------------

When(
  "the moment is moved to {string}",
  function (this: SpecWorld, moment: string) {
    momentOf(this).setTime(new Date(moment).getTime());
  },
);

When(
  "the date it hands back is moved to {string}",
  function (this: SpecWorld, moment: string) {
    lastDateOf(this).toDate().setTime(new Date(moment).getTime());
  },
);

// What it says -----------------------------------------------------------

// What a store or a log would keep, rather than what the value says when it is
// asked: a private field is invisible to JSON, so this is the part that would
// quietly go missing.
When("the read-only date is written down as data", function (this: SpecWorld) {
  this.writtenMoment = JSON.parse(JSON.stringify(lastDateOf(this))) as unknown;
});

Then(
  "what was written as data is {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(this.writtenMoment, written);
  },
);

Then(
  "the read-only date( still) says {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(lastDateOf(this).toISOString(), written);
  },
);

Then("the two read-only dates are the same", function (this: SpecWorld) {
  const [first, second] = twoDatesOf(this);
  assert.ok(
    first.equals(second),
    `${first.toString()} says it is not ${second.toString()}.`,
  );
});

Then("the two read-only dates differ", function (this: SpecWorld) {
  const [first, second] = twoDatesOf(this);
  assert.ok(
    !first.equals(second),
    `${first.toString()} says it is ${second.toString()}.`,
  );
});
