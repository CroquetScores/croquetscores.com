// What is done to tournament players by asking (tournamentPlayerActions.feature),
// asked as the website's page or an app asks: a plain request with no body,
// signed in by a session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const actions: Record<string, string> = {
  "moved up": "up",
  "moved down": "down",
  archived: "archive",
  restored: "restore",
};

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

// Each part of the address by the part of its id after its kind.
const addressOf = (
  world: WebWorld,
  name: string,
  tournament: string,
  action: string,
  api: string,
): string => {
  const id = world.players.get(within(tournament, name));
  assert.ok(id !== undefined, `No player called ${name}.`);
  return `${api}/tournaments/${bare(world, tournament)}/players/${partOf(id)}/${action}`;
};

When(
  new RegExp(
    `^the tournament player "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored)$`,
  ),
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, name, tournament, actions[what]!, "/api/v0"),
    );
  },
);

When(
  new RegExp(
    `^the tournament player "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored) at the address it was at$`,
  ),
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, name, tournament, actions[what]!, "/api/site"),
    );
  },
);

// What the website's own page lists, which is how a manager sees them.
When(
  "the tournament players of {string} are listed to the caller",
  async function (this: WebWorld, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}/api/site/tournaments/${bare(this, tournament)}/players`,
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

const listed = (world: WebWorld): { name: string; archived: boolean }[] =>
  answered(world).body["players"] as { name: string; archived: boolean }[];

Then(
  "the first tournament player the site lists is {string}",
  function (this: WebWorld, name: string) {
    assert.equal(listed(this)[0]?.name, name);
  },
);

Then(
  /^the site lists the tournament player "([^"]*)" as (archived|not archived)$/,
  function (this: WebWorld, name: string, state: string) {
    const found = listed(this).find((each) => each.name === name);
    assert.ok(found !== undefined, `${name} is not listed.`);
    assert.equal(found.archived, state === "archived");
  },
);
