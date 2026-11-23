// A tournament's tests added through the API (tournamentTests.feature), asked
// as the website's page or an app asks: a plain request, signed in by a
// session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

const teamOf = (world: WebWorld, team: string, tournament: string): string => {
  const found = world.teams.get(within(tournament, team));
  assert.ok(found !== undefined, `No team called ${team}.`);
  return partOf(found.id);
};

const testsAt = (world: WebWorld, tournament: string, api: string): string =>
  `${api}/tournaments/${bare(world, tournament)}/tests`;

// A one-day test, played on the day the tournament starts, of one match, as
// the test dialog sends the smallest.
const bodyOf = (
  world: WebWorld,
  first: string,
  second: string,
  tournament: string,
): Record<string, unknown> => {
  const day = String(
    world.tournaments.get(tournament)?.request["starts"],
  ).slice(0, 10);
  return {
    firstTeam: first === "" ? "" : teamOf(world, first, tournament),
    secondTeam: second === "" ? "" : teamOf(world, second, tournament),
    starts: day,
    finishes: day,
    expectedMatches: 1,
    bestOf: 1,
    group: "",
  };
};

When(
  "the test between {string} and {string} is added to {string}",
  async function (
    this: WebWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      testsAt(this, tournament, "/api/v0"),
      bodyOf(this, first, second, tournament),
    );
  },
);

When(
  "the test between {string} and {string} is added to {string} at the address it was at",
  async function (
    this: WebWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      testsAt(this, tournament, "/api/site"),
      bodyOf(this, first, second, tournament),
    );
  },
);

When(
  "a test between no teams is added to {string}",
  async function (this: WebWorld, tournament: string) {
    await told(
      this,
      "POST",
      testsAt(this, tournament, "/api/v0"),
      bodyOf(this, "", "", tournament),
    );
  },
);

// What the website's own page lists, which is how a manager sees them: a test
// is a competition of the tournament.
When(
  "the competitions of {string} are listed to the caller",
  async function (this: WebWorld, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}/api/site/tournaments/${bare(this, tournament)}/competitions`,
      { headers: { cookie: `session=${session!}` } },
    );
    assert.equal(answer.status, 200, "The site would not list them.");
    sceneOf(this).answer = {
      status: answer.status,
      headers: answer.headers,
      body: (await answer.json()) as Record<string, unknown>,
    };
  },
);

Then("the API says the id of the test", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^competition\//);
});

Then("the site lists one competition", function (this: WebWorld) {
  const competitions = answered(this).body["competitions"] as unknown[];
  assert.equal(competitions.length, 1);
});
