import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  CompetitionReference,
  type CompetitionReferenceDetails,
} from "../../../../../src/domain/aggregates/tournaments/CompetitionReference.js";
import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a scenario leaves unsaid. A scenario about one part of a reference gives
// every other part as one that is well made, so that what is refused is only
// ever what the scenario named.
const WELL_MADE = { name: "Block A", slug: "block-a", order: 10000 };

// Making a reference may be refused, and the scenario says which it expects.
const tryToMake = (
  world: SpecWorld,
  details: Partial<CompetitionReferenceDetails>,
): void => {
  try {
    world.competitionReference = CompetitionReference.from(
      CompetitionId.create(),
      { ...WELL_MADE, ...details },
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const referenceOfWorld = (world: SpecWorld): CompetitionReference => {
  assert.ok(
    world.competitionReference !== undefined,
    `No reference has been made: ${inspect(world.failure)}`,
  );
  return world.competitionReference;
};

const otherReferenceOfWorld = (world: SpecWorld): CompetitionReference => {
  assert.ok(
    world.otherCompetitionReference !== undefined,
    "No other reference has been made.",
  );
  return world.otherCompetitionReference;
};

Given(
  "a reference to a competition named {string}",
  function (this: SpecWorld, name: string) {
    this.competitionReference = CompetitionReference.from(
      CompetitionId.create(),
      { ...WELL_MADE, name },
    );
  },
);

Given(
  "another reference with the same id to a competition named {string}",
  function (this: SpecWorld, name: string) {
    this.otherCompetitionReference = CompetitionReference.from(
      referenceOfWorld(this).id,
      { ...WELL_MADE, name },
    );
  },
);

Given(
  "another reference to a competition named {string}",
  function (this: SpecWorld, name: string) {
    this.otherCompetitionReference = CompetitionReference.from(
      CompetitionId.create(),
      { ...WELL_MADE, name },
    );
  },
);

When(
  "a reference to a competition named {string} is made",
  function (this: SpecWorld, name: string) {
    tryToMake(this, { name });
  },
);

When(
  "a reference to a competition with the slug {string} is made",
  function (this: SpecWorld, slug: string) {
    tryToMake(this, { slug });
  },
);

When(
  "a reference to a competition with the order {float} is made",
  function (this: SpecWorld, order: number) {
    tryToMake(this, { order });
  },
);

When(
  "a reference to an archived competition is made",
  function (this: SpecWorld) {
    tryToMake(this, { archived: true });
  },
);

When(
  "a reference to a competition that is not archived is made",
  function (this: SpecWorld) {
    tryToMake(this, { archived: false });
  },
);

When(
  "a reference to a competition is made without saying whether it is archived",
  function (this: SpecWorld) {
    tryToMake(this, {});
  },
);

When("the references are compared", function (this: SpecWorld) {
  this.sameCompetitionReference = referenceOfWorld(this).equals(
    otherReferenceOfWorld(this),
  );
});

Then(
  "the reference's name is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(String(referenceOfWorld(this).name), name);
  },
);

Then(
  "the reference's slug is {string}",
  function (this: SpecWorld, slug: string) {
    assert.equal(String(referenceOfWorld(this).slug), slug);
  },
);

Then(
  "the reference's order is {int}",
  function (this: SpecWorld, order: number) {
    assert.equal(referenceOfWorld(this).order, order);
  },
);

Then("the reference's competition is archived", function (this: SpecWorld) {
  assert.equal(referenceOfWorld(this).archived, true);
});

Then("the reference's competition is not archived", function (this: SpecWorld) {
  assert.equal(referenceOfWorld(this).archived, false);
});

Then("they are the same reference", function (this: SpecWorld) {
  assert.equal(this.sameCompetitionReference, true);
});

Then("they are different references", function (this: SpecWorld) {
  assert.equal(this.sameCompetitionReference, false);
});
