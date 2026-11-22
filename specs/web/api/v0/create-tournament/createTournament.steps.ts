// A tournament created through the API (createTournament.feature), asked as the
// website's page or an app asks: a plain request, signed in by a session, a
// key or neither, as the scenario chose.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, told } from "../apiOfApps.js";

// What a tournament is when the scenario says nothing else, which is what the
// new tournament page sends for the sport and format offered first.
const usual = (name: string): Record<string, unknown> => ({
  name,
  starts: "2026-10-03T00:00:00Z",
  finishes: "2026-10-05T00:00:00Z",
  format: "Standard",
  sport: "ac",
  country: "au",
  region: "vic",
});

const create = async (
  world: WebWorld,
  tournament: Record<string, unknown>,
  at = "/api/v0/tournaments",
): Promise<void> => {
  const answer = await told(world, "POST", at, tournament);
  const name = tournament["name"];
  if (answer.status === 201 && typeof name === "string") {
    // Known by the name it was given, as the tournaments a scenario says are
    // already there are, so that what asks about it can name it.
    world.tournaments.set(name, {
      id: String(answer.body["id"]),
      manager: "",
      request: tournament,
      address: String(answer.body["address"]),
    });
  }
};

When(
  "the tournament {string} is created",
  async function (this: WebWorld, name: string) {
    await create(this, usual(name));
  },
);

When(
  "the tournament {string} is created at the address it was at",
  async function (this: WebWorld, name: string) {
    await create(this, usual(name), "/api/site/tournaments");
  },
);

When("a tournament with no name is created", async function (this: WebWorld) {
  await create(this, usual(""));
});

When(
  "a tournament that finishes before it starts is created",
  async function (this: WebWorld) {
    await create(this, {
      ...usual("Spring Open"),
      starts: "2026-10-05T00:00:00Z",
      finishes: "2026-10-03T00:00:00Z",
    });
  },
);

Given(
  "a tournament with no name has been created {int} times",
  async function (this: WebWorld, times: number) {
    for (let each = 0; each < times; each++) await create(this, usual(""));
  },
);

When(
  "a tournament with no name and no country is created",
  async function (this: WebWorld) {
    await create(this, { ...usual(""), country: "" });
  },
);

Then(
  "the API lists the broken rule {string}",
  function (this: WebWorld, code: string) {
    const { broken } = answered(this).body;
    assert.ok(Array.isArray(broken), "The API listed no broken rules.");
    assert.ok(
      (broken as { code: string }[]).some((each) => each.code === code),
      `The API did not list ${code}: ${JSON.stringify(broken)}`,
    );
  },
);

Given(
  "an address there is nothing at has been posted to {int} times",
  async function (this: WebWorld, times: number) {
    for (let each = 0; each < times; each++) {
      await told(this, "POST", "/api/v0/nothing-is-here");
    }
  },
);

When(
  "an address there is nothing at is posted to",
  async function (this: WebWorld) {
    await told(this, "POST", "/api/v0/nothing-is-here");
  },
);

Then("the API says where the tournament is", function (this: WebWorld) {
  const { id, address } = answered(this).body;
  assert.match(String(id), /^tournament\//);
  assert.match(String(address), /^2026\/ac\//);
});
