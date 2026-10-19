import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  ORDER_STEP,
  orderAfter,
  orderPast,
  orderRules,
} from "../../../../src/domain/common/orders.js";
import { ValidationError } from "../../../../src/domain/common/validation/ValidationError.js";
import type { SpecWorld } from "../../../support/world.js";

interface Ordering {
  listed: { order: number }[];
  given: number | undefined;
  asked: boolean;
  refusal: string | undefined;
  checked: boolean;
}

const orderings = new WeakMap<SpecWorld, Ordering>();

const orderingOf = (world: SpecWorld): Ordering => {
  let ordering = orderings.get(world);
  if (ordering === undefined) {
    ordering = {
      listed: [],
      given: undefined,
      asked: false,
      refusal: undefined,
      checked: false,
    };
    orderings.set(world, ordering);
  }
  return ordering;
};

// The codes are only what the rules were made with here, so the scenarios can
// say which of the two was broken.
const rules = orderRules("OrderNotWhole", "OrderTooSmall");

When("the order {string} is checked", function (this: SpecWorld, text: string) {
  const ordering = orderingOf(this);
  ordering.checked = true;
  try {
    rules.ensureValid(Number(text));
  } catch (error) {
    assert.ok(error instanceof ValidationError, "Expected a refusal.");
    ordering.refusal = String(error.code);
  }
});

Then(
  "the order is refused for breaking {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(orderingOf(this).refusal, code);
  },
);

Then("the order is kept", function (this: SpecWorld) {
  const ordering = orderingOf(this);
  assert.ok(ordering.checked, "No order has been checked.");
  assert.equal(ordering.refusal, undefined);
});

Given("nothing is listed", function (this: SpecWorld) {
  orderingOf(this).listed = [];
});

Given("something listed at {int}", function (this: SpecWorld, order: number) {
  orderingOf(this).listed.push({ order });
});

Given("{int} things listed", function (this: SpecWorld, count: number) {
  orderingOf(this).listed = Array.from({ length: count }, (_, index) => ({
    order: (index + 1) * ORDER_STEP,
  }));
});

Given(
  "things listed at {int}, {int} and {int}",
  function (this: SpecWorld, first: number, second: number, third: number) {
    orderingOf(this).listed = [first, second, third].map((order) => ({
      order,
    }));
  },
);

When("something is put last", function (this: SpecWorld) {
  const ordering = orderingOf(this);
  ordering.asked = true;
  ordering.given = orderAfter(ordering.listed);
});

When(
  "the one at place {int} is moved {word}",
  function (this: SpecWorld, place: number, direction: string) {
    assert.ok(direction === "up" || direction === "down");
    const ordering = orderingOf(this);
    ordering.asked = true;
    ordering.given = orderPast(ordering.listed, place, direction);
  },
);

Then("it is given {int}", function (this: SpecWorld, order: number) {
  assert.equal(orderingOf(this).given, order);
});

Then("there is no room for it", function (this: SpecWorld) {
  const ordering = orderingOf(this);
  assert.ok(ordering.asked, "Nothing has been asked for.");
  assert.equal(ordering.given, undefined);
});
