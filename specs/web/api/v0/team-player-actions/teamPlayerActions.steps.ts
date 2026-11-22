// What is done to team players by asking (teamPlayerActions.feature),
// asked as the website's page or an app asks: a plain request with no body,
// signed in by a session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, told } from "../apiOfApps.js";
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
  teamName: string,
  tournament: string,
  action: string,
  api: string,
): string => {
  const team = world.teams.get(within(tournament, teamName));
  assert.ok(team !== undefined, `No team called ${teamName}.`);
  const id = world.teamPlayers.get(within(tournament, name));
  assert.ok(id !== undefined, `No team player called ${name}.`);
  return `${api}/tournaments/${bare(world, tournament)}/teams/${partOf(team.id)}/players/${partOf(id)}/${action}`;
};

When(
  new RegExp(
    `^the team player "([^"]*)" of the team "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored)$`,
  ),
  async function (
    this: WebWorld,
    name: string,
    teamName: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, name, teamName, tournament, actions[what]!, "/api/v0"),
    );
  },
);

When(
  new RegExp(
    `^the team player "([^"]*)" of the team "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored) at the address it was at$`,
  ),
  async function (
    this: WebWorld,
    name: string,
    teamName: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, name, teamName, tournament, actions[what]!, "/api/site"),
    );
  },
);

const listed = (world: WebWorld): { name: string; archived: boolean }[] =>
  answered(world).body["players"] as { name: string; archived: boolean }[];

Then(
  "the first team player the site lists is {string}",
  function (this: WebWorld, name: string) {
    assert.equal(listed(this)[0]?.name, name);
  },
);

Then(
  /^the site lists the team player "([^"]*)" as (archived|not archived)$/,
  function (this: WebWorld, name: string, state: string) {
    const found = listed(this).find((each) => each.name === name);
    assert.ok(found !== undefined, `${name} is not listed.`);
    assert.equal(found.archived, state === "archived");
  },
);
