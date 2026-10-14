import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { PlayerOfWebsite } from "../../../../../src/application/operations/tournaments/PlayerOfWebsite.js";
import type { PlayerOfWebsiteFound } from "../../../../../src/application/operations/tournaments/searching.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the scenarios here do and say of a player of the website
// (`PlayerOfWebsite.feature`), asked with nobody signed in.

const asked = async (
  world: SpecWorld,
  website: string,
  slug: unknown,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new PlayerOfWebsite(website, slug as string),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const player = (world: SpecWorld): PlayerOfWebsiteFound => {
  assert.ok(
    world.answer !== undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as PlayerOfWebsiteFound;
};

When(
  "the player {string} of the website is asked for",
  async function (this: SpecWorld, slug: string) {
    await asked(this, "croquetscores.com", slug);
  },
);

When(
  "the player {string} of the website {string} is asked for",
  async function (this: SpecWorld, slug: string, website: string) {
    await asked(this, website, slug);
  },
);

When(
  "the player of the website is asked for by something that is not text",
  async function (this: SpecWorld) {
    await asked(this, "croquetscores.com", 42);
  },
);

Then("the player is called {string}", function (this: SpecWorld, name: string) {
  assert.equal(player(this).name, name);
});

const named = (world: SpecWorld, name: string) =>
  player(world).tournaments.find((each) => each.name === name);

Then(
  "the player is in the tournament {string}",
  function (this: SpecWorld, tournament: string) {
    assert.ok(
      named(this, tournament) !== undefined,
      `${tournament} is not answered.`,
    );
  },
);

Then(
  "the player is not in the tournament {string}",
  function (this: SpecWorld, tournament: string) {
    assert.ok(
      named(this, tournament) === undefined,
      `${tournament} is answered.`,
    );
  },
);

Then(
  /^the player is in (\d+) tournaments?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(player(this).tournaments.length, Number(count));
  },
);

Then(
  "the player's tournament {string} is found at the address {string}",
  function (this: SpecWorld, tournament: string, address: string) {
    assert.equal(named(this, tournament)?.address, address);
  },
);

Then(
  "the player's page in the tournament {string} is found at the address {string}",
  function (this: SpecWorld, tournament: string, address: string) {
    assert.equal(named(this, tournament)?.playerAddress, address);
  },
);

Then(
  /^the (first|second) tournament of the player is "([^"]*)"$/,
  function (this: SpecWorld, which: string, tournament: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal(player(this).tournaments[place]?.name, tournament);
  },
);
