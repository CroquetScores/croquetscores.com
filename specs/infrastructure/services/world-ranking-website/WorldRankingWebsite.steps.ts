// Reading the players' lists from the world rankings' site
// (WorldRankingWebsite.feature), from the fake stood up by "a fake of the
// world rankings" (specs/infrastructure/support/worldRankings.ts).
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  DuplicateNamesRefused,
  ListRefused,
} from "../../../../src/application/services/WorldRankingLists.js";
import { SPORT, sportCalled } from "../../support/worldRankings.js";
import type { SpecWorld } from "../../../support/world.js";

// What the last reading answered, or what it was refused with, kept apart for
// each scenario.
// A player as read, with the number the rankings give them.
interface Read {
  readonly name: string;
  readonly worldRankingId: number;
  // Where the line says one.
  readonly country?: string | undefined;
}

const read = new WeakMap<
  SpecWorld,
  { players?: readonly Read[]; refused?: unknown }
>();

const readOf = (world: SpecWorld): readonly Read[] => {
  const found = read.get(world);
  assert.ok(found !== undefined, "Nothing has been read.");
  assert.ok(
    found.players !== undefined,
    `The reading was refused: ${inspect(found.refused)}.`,
  );
  return found.players;
};

When(
  new RegExp(`^the ${SPORT} list is read$`),
  async function (this: SpecWorld, sport: string) {
    const lists = this.worldRankingLists;
    assert.ok(lists !== undefined, "There is no fake of the world rankings.");
    try {
      const players =
        sportCalled(sport) === "ac"
          ? await lists.associationCroquetPlayers()
          : await lists.golfCroquetPlayers();
      read.set(this, { players });
    } catch (refused) {
      read.set(this, { refused });
    }
  },
);

Then(
  "the first player read is {string}",
  function (this: SpecWorld, fullName: string) {
    assert.equal(readOf(this)[0]?.name, fullName);
  },
);

Then("the first player read has no country", function (this: SpecWorld) {
  assert.equal(readOf(this)[0]?.country, undefined);
});

Then(
  "the first player read is from {string}",
  function (this: SpecWorld, country: string) {
    assert.equal(readOf(this)[0]?.country, country);
  },
);

Then(
  "the first player read has the world ranking number {int}",
  function (this: SpecWorld, number: number) {
    assert.equal(readOf(this)[0]?.worldRankingId, number);
  },
);

Then(
  /^(\d+) players? (?:is|are) read$/,
  function (this: SpecWorld, count: string) {
    const players = readOf(this);
    assert.equal(players.length, Number(count), `Read ${inspect(players)}.`);
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

const duplicatesOf = (world: SpecWorld): DuplicateNamesRefused => {
  const refused = read.get(world)?.refused;
  assert.ok(
    refused instanceof DuplicateNamesRefused,
    `Expected duplicate names, and got ${inspect(read.get(world))}.`,
  );
  return refused;
};

Then("the refusal names {string}", function (this: SpecWorld, name: string) {
  assert.ok(duplicatesOf(this).duplicates.some((each) => each.name === name));
});

Then(
  "the refusal names the world ranking number {int}",
  function (this: SpecWorld, number: number) {
    assert.ok(
      duplicatesOf(this).duplicates.some((each) =>
        each.worldRankingIds.includes(number),
      ),
    );
  },
);
