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

// The lines that are of a competition, in the order answered.
const competitions = (world: SpecWorld) =>
  player(world).entries.filter((entry) => entry.competition !== undefined);

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

Then(
  "the player is in the competition {string} of the tournament {string}",
  function (this: SpecWorld, competition: string, tournament: string) {
    assert.ok(
      competitions(this).some(
        (entry) =>
          entry.competition?.name === competition &&
          entry.tournament.name === tournament,
      ),
      `${competition} of ${tournament} is not answered.`,
    );
  },
);

Then(
  "the player is not in the competition {string} of the tournament {string}",
  function (this: SpecWorld, competition: string, tournament: string) {
    assert.ok(
      !competitions(this).some(
        (entry) =>
          entry.competition?.name === competition &&
          entry.tournament.name === tournament,
      ),
      `${competition} of ${tournament} is answered.`,
    );
  },
);

Then(
  "the player's competition {string} is found at the address {string}",
  function (this: SpecWorld, competition: string, address: string) {
    const found = competitions(this).find(
      (entry) => entry.competition?.name === competition,
    );
    assert.ok(found !== undefined, `${competition} is not answered.`);
    assert.equal(found.competition?.address, address);
  },
);

Then(
  "the player's tournament {string} is found at the address {string}",
  function (this: SpecWorld, tournament: string, address: string) {
    const found = player(this).entries.find(
      (entry) => entry.tournament.name === tournament,
    );
    assert.ok(found !== undefined, `${tournament} is not answered.`);
    assert.equal(found.tournament.address, address);
  },
);

Then(
  /^the player is in (\d+) competitions$/,
  function (this: SpecWorld, count: string) {
    assert.equal(competitions(this).length, Number(count));
  },
);

Then(
  "the player is in the tournament {string} and in none of its competitions",
  function (this: SpecWorld, tournament: string) {
    const there = player(this).entries.filter(
      (entry) => entry.tournament.name === tournament,
    );
    assert.ok(there.length > 0, `${tournament} is not answered.`);
    assert.ok(
      there.every((entry) => entry.competition === undefined),
      `${tournament} is answered with a competition.`,
    );
  },
);

Then(
  /^the (first|second) competition answered is "([^"]*)" of the tournament "([^"]*)"$/,
  function (
    this: SpecWorld,
    which: string,
    competition: string,
    tournament: string,
  ) {
    const entry = competitions(this)[["first", "second"].indexOf(which)];
    assert.equal(entry?.competition?.name, competition);
    assert.equal(entry?.tournament.name, tournament);
  },
);
