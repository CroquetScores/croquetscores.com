import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import {
  dayOf,
  testNamed,
  type TestShape,
} from "../../../../../../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { eventually } from "../../../../../../../support/tournamentPage.js";

// The test dialog (test.feature), open over a tournament's Tests tab. What it
// shares with the player dialog, being a modal dialog of the same kind, is
// said once for all in player.steps.ts, and what finds a field by its label
// and reads what it says in new.steps.ts; these are what it adds: the teams
// it offers, its days, and what was kept.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

// A field by the words it is labelled with, as the reader finds it.
const fieldOf = (world: SpecWorld, label: string): Locator =>
  dialogOf(world).getByLabel(label, { exact: true });

// The teams offered, without the choice of nobody each begins on, once they
// have arrived, which takes a moment after the dialog opens.
const teamsOffered = async (
  world: SpecWorld,
  label: string,
): Promise<string[]> => {
  await fieldOf(world, label)
    .locator('option:not([value=""])')
    .first()
    .waitFor({ state: "attached", timeout: 10_000 });
  return (await fieldOf(world, label).locator("option").allInnerTexts())
    .map((name) => name.trim())
    .filter((name) => name !== "");
};

// Its teams -------------------------------------------------------------------

Given(
  "the team {string} is chosen as {string}",
  async function (this: SpecWorld, team: string, label: string) {
    await eventually(this, async () => {
      assert.ok((await teamsOffered(this, label)).includes(team));
    });
    await fieldOf(this, label).selectOption({ label: team });
  },
);

Then(
  "no team is chosen as {string}",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      assert.equal(await fieldOf(this, label).inputValue(), "");
    });
  },
);

Then(
  "the team {string} is offered as {string}",
  async function (this: SpecWorld, team: string, label: string) {
    await eventually(this, async () => {
      assert.ok((await teamsOffered(this, label)).includes(team));
    });
  },
);

Then(
  "the team {string} is not offered as {string}",
  async function (this: SpecWorld, team: string, label: string) {
    await eventually(this, async () => {
      const offered = await teamsOffered(this, label);
      assert.ok(!offered.includes(team), `${team} is offered.`);
    });
  },
);

Then(
  "the team {string} is offered before the team {string} as {string}",
  async function (this: SpecWorld, one: string, other: string, label: string) {
    await eventually(this, async () => {
      const offered = await teamsOffered(this, label);
      assert.ok(
        offered.includes(one) &&
          offered.includes(other) &&
          offered.indexOf(one) < offered.indexOf(other),
        `The teams are offered as ${JSON.stringify(offered)}.`,
      );
    });
  },
);

// A team that cannot be changed is shown as the one it is, in a drop-down
// that cannot be used.
Then(
  "the test dialog shows {string} as {string}",
  async function (this: SpecWorld, team: string, label: string) {
    await eventually(this, async () => {
      assert.equal(
        (
          await fieldOf(this, label)
            .locator("option:checked")
            .innerText({ timeout: 500 })
        ).trim(),
        team,
      );
    });
  },
);

// Its days ------------------------------------------------------------------------

// Chosen from the browser's picker of days, or typed where the picker offers
// no such day: either way it is what the field holds.
Given(
  /^"([^"]*)" is (?:chosen|typed) as "([^"]*)"$/,
  async function (this: SpecWorld, day: string, label: string) {
    await fieldOf(this, label).fill(day);
  },
);

for (const [said, attribute] of [
  ["before", "min"],
  ["after", "max"],
] as const) {
  Then(
    `{string} offers no day ${said} {string}`,
    async function (this: SpecWorld, label: string, day: string) {
      await eventually(this, async () => {
        assert.equal(
          await fieldOf(this, label).getAttribute(attribute, { timeout: 500 }),
          day,
        );
      });
    },
  );
}

// How it is asked -------------------------------------------------------------------

Then(
  "{string} is typed on a keypad of numbers",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      await fieldOf(this, label).getAttribute("inputmode"),
      "numeric",
    );
  },
);

// The first of what the reader fills in or chooses, in the order a reader
// meets them.
Then(
  "{string} is the first thing the test dialog asks for",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    const first = dialogOf(this)
      .locator(".dialog-content :is(input, select, textarea)")
      .first();
    assert.equal(
      await first.evaluate(
        (element, named) => element === named,
        await fieldOf(this, label).elementHandle(),
      ),
      true,
      `${label} is not the first thing asked for.`,
    );
  },
);

Then(
  "{string} comes after {string}",
  async function (this: SpecWorld, later: string, earlier: string) {
    await dialogOf(this).waitFor();
    const boxOf = async (label: string) => {
      const box = await fieldOf(this, label).boundingBox();
      assert.ok(box !== null, `${label} is not laid out.`);
      return box;
    };
    const [first, second] = [await boxOf(earlier), await boxOf(later)];
    assert.ok(first.y + first.height <= second.y, `${later} is not after.`);
  },
);

// What is said above the fields, about no one of them, by its code.
Then(
  "the test dialog is refused above its fields with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await dialogOf(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `Above the fields says ${refused || "nothing"}.`,
      );
    });
  },
);

// What was kept ------------------------------------------------------------------

const testsOf = async (world: SpecWorld, tournament: string) =>
  (await load(world, tournamentNamed(world, tournament))).competitions.filter(
    ({ shape }) => shape.kind === "test",
  );

const shapeOf = async (
  world: SpecWorld,
  tournament: string,
  name: string,
): Promise<TestShape> => {
  let found: TestShape | undefined;
  await eventually(world, async () => {
    found = testNamed(
      await load(world, tournamentNamed(world, tournament)),
      name,
    ).shape;
  });
  assert.ok(found !== undefined);
  return found;
};

Then(
  "{string} has the test {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    await shapeOf(this, tournament, name);
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "{string} has no tests",
  async function (this: SpecWorld, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await testsOf(this, tournament)).length, 0);
    });
  },
);

for (const [said, day] of [
  ["starts", (shape: TestShape) => dayOf(shape.starts)],
  ["finishes", (shape: TestShape) => dayOf(shape.finishes)],
] as const) {
  Then(
    `the test {string} of {string} ${said} on {string}`,
    async function (
      this: SpecWorld,
      name: string,
      tournament: string,
      on: string,
    ) {
      assert.equal(day(await shapeOf(this, tournament, name)), on);
    },
  );
}

Then(
  "the test {string} of {string} is expected to have {int} matches",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    matches: number,
  ) {
    assert.equal(
      (await shapeOf(this, tournament, name)).expectedMatches.count,
      matches,
    );
  },
);

Then(
  "each match of the test {string} of {string} is the best of {int}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    games: number,
  ) {
    await eventually(this, async () => {
      assert.equal((await shapeOf(this, tournament, name)).bestOf.games, games);
    });
  },
);

Then(
  "the test {string} of {string} is in the group {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    group: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        String((await shapeOf(this, tournament, name)).group),
        group,
      );
    });
  },
);

Then(
  "the test {string} of {string} is in no group",
  async function (this: SpecWorld, name: string, tournament: string) {
    assert.equal((await shapeOf(this, tournament, name)).group, undefined);
  },
);

Then(
  /^the test "([^"]*)" of "([^"]*)" has a maximum of (\d+) hoops$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    hoops: string,
  ) {
    let maximumHoops: number | null | undefined;
    await eventually(this, async () => {
      maximumHoops = testNamed(
        await load(this, tournamentNamed(this, tournament)),
        name,
      ).rules.maximumHoops;
    });
    assert.equal(maximumHoops, Number(hoops));
  },
);
