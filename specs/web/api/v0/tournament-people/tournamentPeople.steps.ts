// A tournament's scorers and managers made and taken off through the API
// (tournamentPeople.feature), asked as the website's page or an app asks: a
// plain request, signed in by a session, a key or neither, as the scenario
// chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

type Part = "scorer" | "manager";

const peopleAt = (
  world: WebWorld,
  tournament: string,
  part: Part,
  api: string,
): string => `${api}/tournaments/${bare(world, tournament)}/${part}s`;

When(
  /^"([^"]*)" is made a (scorer|manager) of "([^"]*)"$/,
  async function (
    this: WebWorld,
    emailAddress: string,
    part: Part,
    tournament: string,
  ) {
    await told(this, "POST", peopleAt(this, tournament, part, "/api/v0"), {
      emailAddress,
    });
  },
);

When(
  /^"([^"]*)" is made a (scorer|manager) of "([^"]*)" at the address it was at$/,
  async function (
    this: WebWorld,
    emailAddress: string,
    part: Part,
    tournament: string,
  ) {
    await told(this, "POST", peopleAt(this, tournament, part, "/api/site"), {
      emailAddress,
    });
  },
);

// What the website's own page lists, which is how a manager sees them.
When(
  /^the (scorer|manager)s of "([^"]*)" are listed to the caller$/,
  async function (this: WebWorld, part: Part, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${peopleAt(this, tournament, part, "/api/site")}`,
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

const listed = (world: WebWorld): { id: string; name: string }[] => {
  const { body } = answered(world);
  return (body["scorers"] ?? body["managers"]) as {
    id: string;
    name: string;
  }[];
};

Then(
  "the site lists the person {string}",
  function (this: WebWorld, name: string) {
    assert.ok(
      listed(this).some((each) => each.name === name),
      `${name} is not listed.`,
    );
  },
);

Then(
  "the site does not list the person {string}",
  function (this: WebWorld, name: string) {
    assert.ok(
      !listed(this).some((each) => each.name === name),
      `${name} is listed.`,
    );
  },
);
