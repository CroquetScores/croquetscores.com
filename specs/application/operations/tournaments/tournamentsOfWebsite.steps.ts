import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { TournamentOfWebsite } from "../../../../src/application/operations/tournaments/tournamentsOfWebsite.js";
import type { SpecWorld } from "../../../support/world.js";

// What the recent results and the upcoming tournaments both say of what they
// answered, since each answers a list of a website's tournaments and says the
// same of each one. What each asks is beside its own feature.

const answered = (world: SpecWorld): readonly TournamentOfWebsite[] => {
  assert.ok(
    Array.isArray(world.answer),
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as readonly TournamentOfWebsite[];
};

const answeredCalled = (
  world: SpecWorld,
  name: string,
): TournamentOfWebsite => {
  const called = answered(world).filter((each) => each.name === name);
  assert.equal(
    called.length,
    1,
    `${String(called.length)} are called ${name}.`,
  );
  return called[0]!;
};

Then("{string} is answered", function (this: SpecWorld, name: string) {
  answeredCalled(this, name);
});

Then("{string} is not answered", function (this: SpecWorld, name: string) {
  assert.ok(
    !answered(this).some((each) => each.name === name),
    `${name} is answered.`,
  );
});

Then(
  /^(\d+) tournaments? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).length, Number(count));
  },
);

Then(
  /^the (first|second) tournament answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal(answered(this)[place]?.name, name);
  },
);

Then(
  "{string} is answered as starting on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(answeredCalled(this, name).starts, day);
  },
);

Then(
  "{string} is answered as finishing on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(answeredCalled(this, name).finishes, day);
  },
);

Then(
  "{string} is answered as played in the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    assert.equal(answeredCalled(this, name).country, country);
  },
);

Then(
  "{string} is answered at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(answeredCalled(this, name).address, address);
  },
);
