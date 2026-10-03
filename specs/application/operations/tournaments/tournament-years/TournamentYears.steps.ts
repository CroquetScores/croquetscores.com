import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentYears } from "../../../../../src/application/operations/tournaments/TournamentYears.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

const yearsAnswered = (world: SpecWorld): readonly number[] => {
  assert.ok(
    Array.isArray(world.answer),
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as readonly number[];
};

// Asked with nobody signed in.
const ask = async (
  world: SpecWorld,
  website: string,
  sport?: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new TournamentYears(website, sport),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the years of tournaments are asked for",
  async function (this: SpecWorld) {
    await ask(this, "croquetscores.com");
  },
);

When(
  "the years of tournaments on {string} are asked for",
  async function (this: SpecWorld, website: string) {
    await ask(this, website);
  },
);

When(
  "the years of tournaments for the sport {string} are asked for",
  async function (this: SpecWorld, sport: string) {
    await ask(this, "croquetscores.com", sport);
  },
);

Then("the year {int} is answered", function (this: SpecWorld, year: number) {
  assert.ok(yearsAnswered(this).includes(year), `${String(year)} is not.`);
});

Then(
  "the year {int} is not answered",
  function (this: SpecWorld, year: number) {
    assert.ok(!yearsAnswered(this).includes(year), `${String(year)} is.`);
  },
);

Then(
  /^the (first|second|third) year answered is (\d+)$/,
  function (this: SpecWorld, which: string, year: string) {
    const place = ["first", "second", "third"].indexOf(which);
    assert.equal(yearsAnswered(this)[place], Number(year));
  },
);

Then(
  /^(\d+) years? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(yearsAnswered(this).length, Number(count));
  },
);

Then("no year is answered", function (this: SpecWorld) {
  assert.deepEqual(yearsAnswered(this), []);
});
