import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  inHandOf,
  load,
  tournamentNamed,
} from "../../../../../../../../../../application/operations/tournaments/aRequest.js";
import { testNamed } from "../../../../../../../../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../../../support/marks.js";
import { eventually } from "../../../../../../../../../support/tournamentPage.js";

// The score dialog over a test's page (test-score.feature). It is a
// competition's score dialog, read by its steps (score-modal-dialog.steps.ts);
// these are what a test adds: its players offered under their teams' names,
// and the games kept in it.

const open = "dialog[open]";

const fieldOf = (world: SpecWorld, label: string): Locator =>
  world.browserPage.locator(open).getByLabel(label, { exact: true });

// The players offered, each with the team they are offered under, once they
// have arrived, which takes a moment after the dialog opens.
const offered = async (
  world: SpecWorld,
  label: string,
): Promise<{ name: string; team: string }[]> => {
  await fieldOf(world, label)
    .locator('option:not([value=""])')
    .first()
    .waitFor({ state: "attached", timeout: 10_000 });
  return Promise.all(
    (await fieldOf(world, label).locator('option:not([value=""])').all()).map(
      async (option) => ({
        name: (await option.innerText()).trim(),
        // The group it is offered under.
        team: (await option.locator("xpath=..").getAttribute("label")) ?? "",
      }),
    ),
  );
};

Then(
  "{string} is offered under {string} as the {string}",
  async function (this: SpecWorld, name: string, team: string, label: string) {
    await eventually(this, async () => {
      const all = await offered(this, label);
      assert.ok(
        all.some((each) => each.name === name && each.team === team),
        `They are offered as ${JSON.stringify(all)}.`,
      );
    });
  },
);

Then(
  "{string} is offered after {string} as the {string}",
  async function (this: SpecWorld, one: string, other: string, label: string) {
    await eventually(this, async () => {
      const names = (await offered(this, label)).map(({ name }) => name);
      assert.ok(
        names.includes(one) &&
          names.includes(other) &&
          names.indexOf(other) < names.indexOf(one),
        `They are offered as ${JSON.stringify(names)}.`,
      );
    });
  },
);

// The teams' names are what the manager typed, and so are the players'; the
// teams' name the groups the players are offered under, which is no text of
// the dialog's own.
Then(
  "every word in the score dialog but the teams' and the players' names is in the test locale",
  async function (this: SpecWorld) {
    await this.browserPage.locator(open).waitFor();
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, open, ["select option"]);
      assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
    });
  },
);

// What was kept: the test's own stream, read back -------------------------------

const gamesOf = async (world: SpecWorld, test: string, name: string) => {
  const tournament = await load(world, tournamentNamed(world, name));
  const { reference } = testNamed(tournament, test);
  const kept = await inHandOf(world).loadCompetition(reference.id);
  const players = tournament.teams.flatMap((team) => team.players);
  const nameOf = (id: unknown): string =>
    players
      .find((player) => player.id.equals(id as typeof player.id))
      ?.name.toString() ?? "";
  return (kept?.games ?? []).map((game) => ({
    winner: nameOf(game.winner),
    loser: nameOf(game.loser),
    scores: `${String(game.winnerScore)} to ${String(game.loserScore)}`,
  }));
};

Then(
  "the test {string} of {string} has the game of {string} beating {string} {int} to {int}",
  async function (
    this: SpecWorld,
    test: string,
    name: string,
    winner: string,
    loser: string,
    winnerScore: number,
    loserScore: number,
  ) {
    await eventually(this, async () => {
      const games = await gamesOf(this, test, name);
      assert.ok(
        games.some(
          (game) =>
            game.winner === winner &&
            game.loser === loser &&
            game.scores === `${String(winnerScore)} to ${String(loserScore)}`,
        ),
        `${test} has ${JSON.stringify(games)}.`,
      );
    });
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "the test {string} of {string} has no games",
  async function (this: SpecWorld, test: string, name: string) {
    await eventually(this, async () => {
      assert.deepEqual(await gamesOf(this, test, name), []);
    });
  },
);
