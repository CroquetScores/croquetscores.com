// A tournament's players added through the API (tournamentPlayers.feature),
// asked as the website's page or an app asks: a plain request, signed in by a
// session, a key or neither, as the scenario chose. Listing them, and the steps
// that say what a manager sees, are in tournamentPlayerActions.steps.ts.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const playersAt = (world: WebWorld, tournament: string, api: string): string =>
  `${api}/tournaments/${bare(world, tournament)}/players`;

// Asked with whatever the scenario said the next player is to be, as the
// player dialog sends it.
const add = async (
  world: WebWorld,
  name: string,
  tournament: string,
  api: string,
) =>
  told(world, "POST", playersAt(world, tournament, api), {
    name,
    ...world.ofTheNextPlayer,
  });

When(
  "the player {string} is added to {string}",
  async function (this: WebWorld, name: string, tournament: string) {
    const answer = await add(this, name, tournament, "/api/v1");
    // Known by its name within its tournament, as the players a scenario says
    // are already there are, so that what asks about it can name it.
    if (answer.status === 201) {
      this.players.set(within(tournament, name), String(answer.body["id"]));
    }
  },
);

When(
  "the player {string} is added to {string} at the address it was at",
  async function (this: WebWorld, name: string, tournament: string) {
    await add(this, name, tournament, "/api/site");
  },
);

Then("the API says the id of the tournament player", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^tournament-player\//);
});

const listed = (world: WebWorld): { name: string; representing?: string }[] =>
  answered(world).body["players"] as { name: string; representing?: string }[];

Then(
  "the site lists the tournament player {string}",
  function (this: WebWorld, name: string) {
    assert.ok(
      listed(this).some((each) => each.name === name),
      `${name} is not listed.`,
    );
  },
);

Then(
  "the site lists the tournament player {string} as representing {string}",
  function (this: WebWorld, name: string, representing: string) {
    const found = listed(this).find((each) => each.name === name);
    assert.ok(found !== undefined, `${name} is not listed.`);
    assert.equal(found.representing, representing);
  },
);
