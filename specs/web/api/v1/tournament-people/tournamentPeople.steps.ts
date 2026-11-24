// A tournament's scorers and managers made and taken off through the API
// (tournamentPeople.feature), asked as the website's page or an app asks: a
// plain request, signed in by a session, a key or neither, as the scenario
// chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { sessionFor } from "../../../support/control.js";
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
    await told(this, "POST", peopleAt(this, tournament, part, "/api/v1"), {
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

// Who is on the tournament is read as the website's own page reads it, which
// is where a scenario finds the account to take off, since an account's id is
// not something a scenario knows.
const accountOf = async (
  world: WebWorld,
  part: Part,
  name: string,
  tournament: string,
): Promise<string> => {
  const answer = await fetch(
    `${world.baseUrl!}${peopleAt(world, tournament, part, "/api/site")}`,
    {
      headers: {
        cookie: `session=${await sessionFor("organiser@example.com")}`,
      },
    },
  );
  const found = (
    (await answer.json()) as Record<string, { id: string; name: string }[]>
  )[`${part}s`]?.find((each) => each.name === name);
  assert.ok(found !== undefined, `${name} is not a ${part}.`);
  return found.id.slice(found.id.indexOf("/") + 1);
};

When(
  /^the (scorer|manager) "([^"]*)" is taken off "([^"]*)"$/,
  async function (
    this: WebWorld,
    part: Part,
    name: string,
    tournament: string,
  ) {
    const account = await accountOf(this, part, name, tournament);
    await told(
      this,
      "POST",
      `${peopleAt(this, tournament, part, "/api/v1")}/${account}/remove`,
    );
  },
);

When(
  /^the (scorer|manager) "([^"]*)" is taken off "([^"]*)" at the address it was at$/,
  async function (
    this: WebWorld,
    part: Part,
    name: string,
    tournament: string,
  ) {
    const account = await accountOf(this, part, name, tournament);
    await told(
      this,
      "POST",
      `${peopleAt(this, tournament, part, "/api/site")}/${account}/remove`,
    );
  },
);
