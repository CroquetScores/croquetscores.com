import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { SearchPlayersOfWebsite } from "../../../../../src/application/operations/tournaments/SearchPlayersOfWebsite.js";
import type { PlayerFound } from "../../../../../src/application/operations/tournaments/searching.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the scenarios here do and say of the search of a website's players
// (`SearchPlayersOfWebsite.feature`), asked with nobody signed in.

const searched = async (
  world: SpecWorld,
  website: string,
  text: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new SearchPlayersOfWebsite(website, text),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const listed = (world: SpecWorld): readonly PlayerFound[] => {
  assert.ok(
    Array.isArray(world.answer),
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as readonly PlayerFound[];
};

When(
  "the players of the website matching {string} are asked for",
  async function (this: SpecWorld, text: string) {
    await searched(this, "croquetscores.com", text);
  },
);

When(
  "the players of the website {string} matching {string} are asked for",
  async function (this: SpecWorld, website: string, text: string) {
    await searched(this, website, text);
  },
);

Then(
  "the search finds the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      listed(this).some((each) => each.name === name),
      `${name} is not listed.`,
    );
  },
);

Then(
  "the search does not find the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !listed(this).some((each) => each.name === name),
      `${name} is listed.`,
    );
  },
);

Then(
  "the search finds the player {string} at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    const player = listed(this).find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} is not listed.`);
    assert.equal(player.address, address);
  },
);

Then(
  /^the search finds (\d+) players?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(listed(this).length, Number(count));
  },
);

Then(
  /^the (first|second|third) player the search finds is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      listed(this)[["first", "second", "third"].indexOf(which)]?.name,
      name,
    );
  },
);
