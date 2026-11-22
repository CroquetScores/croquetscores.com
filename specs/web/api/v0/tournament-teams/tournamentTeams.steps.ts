// A tournament's teams added and changed through the API
// (tournamentTeams.feature), asked as the website's page or an app asks: a
// plain request, signed in by a session, a key or neither, as the scenario
// chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

export const teamsAt = (
  world: WebWorld,
  tournament: string,
  api: string,
): string => `${api}/tournaments/${bare(world, tournament)}/teams`;

// A short name is what a team is known by beside its name, here its first
// three letters in capitals as the scenarios that make teams otherwise do.
const bodyOf = (name: string): Record<string, string> => ({
  name,
  shortName: name.slice(0, 3).toUpperCase(),
});

When(
  "the team {string} is added to {string}",
  async function (this: WebWorld, name: string, tournament: string) {
    const answer = await told(
      this,
      "POST",
      teamsAt(this, tournament, "/api/v0"),
      bodyOf(name),
    );
    // Known by its name within its tournament, as the teams a scenario says
    // are already there are, so that what asks about it can name it.
    if (answer.status === 201) {
      this.teams.set(`${tournament}\u0000${name}`, {
        id: String(answer.body["id"]),
        shortName: bodyOf(name)["shortName"]!,
      });
    }
  },
);

When(
  "the team {string} is added to {string} at the address it was at",
  async function (this: WebWorld, name: string, tournament: string) {
    await told(
      this,
      "POST",
      teamsAt(this, tournament, "/api/site"),
      bodyOf(name),
    );
  },
);

// What the website's own page lists, which is how a manager sees them.
When(
  "the teams of {string} are listed to the caller",
  async function (this: WebWorld, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${teamsAt(this, tournament, "/api/site")}`,
      { headers: { cookie: `session=${session!}` } },
    );
    assert.equal(answer.status, 200, "The site would not list the teams.");
    sceneOf(this).answer = {
      status: answer.status,
      headers: answer.headers,
      body: (await answer.json()) as Record<string, unknown>,
    };
  },
);

Then("the API says the id of the team", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^team\//);
});

Then(
  "the site lists the team {string}",
  function (this: WebWorld, name: string) {
    const teams = answered(this).body["teams"] as { name: string }[];
    assert.ok(
      teams.some((each) => each.name === name),
      `${name} is not listed.`,
    );
  },
);

// The team by the part of its id after "team/", as a scenario knows it by its
// name within its tournament.
const teamAt = (
  world: WebWorld,
  team: string,
  tournament: string,
  api: string,
): string => {
  const found = world.teams.get(`${tournament}\u0000${team}`);
  assert.ok(found !== undefined, `No team called ${team}.`);
  return `${teamsAt(world, tournament, api)}/${found.id.slice(found.id.indexOf("/") + 1)}`;
};

When(
  "the player {string} is added to the team {string} of {string}",
  async function (
    this: WebWorld,
    name: string,
    team: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `${teamAt(this, team, tournament, "/api/v0")}/players`,
      { name },
    );
  },
);

When(
  "the player {string} is added to the team {string} of {string} at the address it was at",
  async function (
    this: WebWorld,
    name: string,
    team: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `${teamAt(this, team, tournament, "/api/site")}/players`,
      { name },
    );
  },
);

When(
  "the players of the team {string} of {string} are listed to the caller",
  async function (this: WebWorld, team: string, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${teamAt(this, team, tournament, "/api/site")}/players`,
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

Then("the API says the id of the team player", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^team-player\//);
});

Then(
  "the site lists the team player {string}",
  function (this: WebWorld, name: string) {
    const players = answered(this).body["players"] as { name: string }[];
    assert.ok(
      players.some((each) => each.name === name),
      `${name} is not listed.`,
    );
  },
);
