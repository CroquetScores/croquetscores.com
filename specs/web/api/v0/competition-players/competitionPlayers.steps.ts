// Players entered in a competition through the API (competitionPlayers.feature),
// asked as the website's page or an app asks: a plain request, signed in by a
// session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

// The tournament and the competition, each by the part of its id after its
// kind.
const competitionAt = (
  world: WebWorld,
  competition: string,
  tournament: string,
  api: string,
): string => {
  const id = world.competitions.get(within(tournament, competition));
  assert.ok(id !== undefined, `No competition called ${competition}.`);
  return `${api}/tournaments/${bare(world, tournament)}/competitions/${partOf(id)}`;
};

const playerOf = (world: WebWorld, player: string, tournament: string) => {
  const id = world.players.get(within(tournament, player));
  assert.ok(id !== undefined, `No player called ${player} in ${tournament}.`);
  return { player: partOf(id) };
};

When(
  "the player {string} is put into {string} of {string}",
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `${competitionAt(this, competition, tournament, "/api/v0")}/players`,
      playerOf(this, player, tournament),
    );
  },
);

When(
  "the player {string} is put into {string} of {string} at the address it was at",
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `${competitionAt(this, competition, tournament, "/api/site")}/players`,
      playerOf(this, player, tournament),
    );
  },
);

// What the website's own page lists, which is how a manager sees who is in.
When(
  "the players of {string} in {string} are listed to the caller",
  async function (this: WebWorld, competition: string, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${competitionAt(this, competition, tournament, "/api/site")}/players`,
      { headers: { cookie: `session=${session!}` } },
    );
    assert.equal(answer.status, 200, "The site would not list the players.");
    sceneOf(this).answer = {
      status: answer.status,
      headers: answer.headers,
      body: (await answer.json()) as Record<string, unknown>,
    };
  },
);

Then(
  "the API says the id of the player in the competition",
  function (this: WebWorld) {
    assert.match(String(answered(this).body["id"]), /^competition-player\//);
  },
);

Then(
  "the first player the site lists is {string}",
  function (this: WebWorld, name: string) {
    const players = answered(this).body["players"] as { name: string }[];
    assert.equal(players[0]?.name, name);
  },
);
