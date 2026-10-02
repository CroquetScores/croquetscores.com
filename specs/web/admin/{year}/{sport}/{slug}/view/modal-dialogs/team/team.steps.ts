import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Team } from "../../../../../../../../../src/domain/aggregates/tournaments/Team.js";
import { english } from "../../../../../../../../../src/web/languages/english.js";
import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { eventually } from "../../../../../../../support/tournamentPage.js";

// The team dialog (team.feature), and the team player dialog on a team's page
// (team-player.feature). What they share with the player dialog, being modal
// dialogs of the same kind, is said once for all in player.steps.ts; these are
// what they add: what a field is described by, and what was kept.

// Read from what the field is described by, which is what a screen reader
// reads out with it, so that words said somewhere else on the page do not
// count as said of the field.
Then(
  "{string} is described by the words for {string}",
  async function (this: SpecWorld, label: string, key: string) {
    const words = english.words[key];
    assert.ok(words !== undefined, `English has no words for ${key}.`);
    const field = this.browserPage
      .locator("dialog[open]")
      .getByLabel(label, { exact: true });
    await field.waitFor();
    const described = (await field.getAttribute("aria-describedby")) ?? "";
    const said = await Promise.all(
      described
        .split(" ")
        .filter((id) => id !== "")
        .map(async (id) =>
          (await this.browserPage.locator(`#${id}`).innerText()).trim(),
        ),
    );
    assert.ok(
      said.includes(words),
      `${label} is described by ${JSON.stringify(said)}.`,
    );
  },
);

// What was kept ------------------------------------------------------------------

const teamsOf = async (
  world: SpecWorld,
  tournament: string,
): Promise<readonly Team[]> =>
  (await load(world, tournamentNamed(world, tournament))).teams;

const teamCalled = async (
  world: SpecWorld,
  tournament: string,
  name: string,
): Promise<Team> => {
  let found: Team | undefined;
  await eventually(world, async () => {
    found = (await teamsOf(world, tournament)).find(
      (team) => team.name.toString() === name,
    );
    assert.ok(found !== undefined, `${tournament} has no team ${name}.`);
  });
  assert.ok(found !== undefined);
  return found;
};

Then(
  "{string} has the team {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    await teamCalled(this, tournament, name);
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "{string} has no teams",
  async function (this: SpecWorld, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await teamsOf(this, tournament)).length, 0);
    });
  },
);

Then(
  "the team {string} of {string} is known for short as {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    shortName: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        (await teamCalled(this, tournament, name)).shortName.toString(),
        shortName,
      );
    });
  },
);

Then(
  "the team {string} of {string} flies the flag {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    flag: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        String((await teamCalled(this, tournament, name)).flag),
        flag,
      );
    });
  },
);

Then(
  "the team {string} of {string} flies no flag",
  async function (this: SpecWorld, name: string, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await teamCalled(this, tournament, name)).flag, undefined);
    });
  },
);

const playersOf = async (
  world: SpecWorld,
  tournament: string,
  team: string,
): Promise<string[]> =>
  (await teamCalled(world, tournament, team)).players.map((player) =>
    player.name.toString(),
  );

Then(
  "the team {string} of {string} has the player {string}",
  async function (
    this: SpecWorld,
    team: string,
    tournament: string,
    name: string,
  ) {
    await eventually(this, async () => {
      const players = await playersOf(this, tournament, team);
      assert.ok(players.includes(name), `${team} has ${String(players)}.`);
    });
  },
);

Then(
  "the team {string} of {string} does not have the player {string}",
  async function (
    this: SpecWorld,
    team: string,
    tournament: string,
    name: string,
  ) {
    await eventually(this, async () => {
      assert.ok(!(await playersOf(this, tournament, team)).includes(name));
    });
  },
);

Then(
  "the team {string} of {string} has no players",
  async function (this: SpecWorld, team: string, tournament: string) {
    await eventually(this, async () => {
      assert.deepEqual(await playersOf(this, tournament, team), []);
    });
  },
);
