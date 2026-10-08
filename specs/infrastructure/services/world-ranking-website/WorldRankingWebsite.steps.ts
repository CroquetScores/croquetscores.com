// Reading the players' lists from the world rankings' site
// (WorldRankingWebsite.feature), from the fake stood up by "a fake of the
// world rankings" (specs/infrastructure/support/worldRankings.ts).
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ListRefused } from "../../../../src/application/services/WorldRankingLists.js";
import { SPORT, sportCalled } from "../../support/worldRankings.js";
import type { SpecWorld } from "../../../support/world.js";

// What the last reading answered, or what it was refused with, kept apart for
// each scenario.
const read = new WeakMap<
  SpecWorld,
  { names?: readonly string[]; refused?: unknown }
>();

const readOf = (world: SpecWorld): readonly string[] => {
  const found = read.get(world);
  assert.ok(found !== undefined, "Nothing has been read.");
  assert.ok(
    found.names !== undefined,
    `The reading was refused: ${inspect(found.refused)}.`,
  );
  return found.names;
};

When(
  new RegExp(`^the ${SPORT} list is read$`),
  async function (this: SpecWorld, sport: string) {
    const lists = this.worldRankingLists;
    assert.ok(lists !== undefined, "There is no fake of the world rankings.");
    try {
      read.set(this, { names: await lists.playersOf(sportCalled(sport)) });
    } catch (refused) {
      read.set(this, { refused });
    }
  },
);

Then(
  "the first player read is {string}",
  function (this: SpecWorld, fullName: string) {
    assert.equal(readOf(this)[0], fullName);
  },
);

Then(
  /^(\d+) players? (?:is|are) read$/,
  function (this: SpecWorld, count: string) {
    const names = readOf(this);
    assert.equal(names.length, Number(count), `Read ${inspect(names)}.`);
  },
);

Then("the reading is not refused", function (this: SpecWorld) {
  readOf(this);
});

Then(
  "the reading is refused with {string}",
  function (this: SpecWorld, code: string) {
    const refused = read.get(this)?.refused;
    assert.ok(
      refused instanceof ListRefused,
      `Expected a refusal, and got ${inspect(read.get(this))}.`,
    );
    assert.equal(refused.code, code);
  },
);
