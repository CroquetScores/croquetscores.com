import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import {
  eventually,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The players dialog (players.feature), open over a tournament's page. What
// finds a field, presses a button, and reads a modal dialog or a player kept is
// shared with the player dialog and the admin's other forms; these are what
// this dialog adds.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

// The one box, found by the label the dialog gives it.
const box = (world: SpecWorld): Locator =>
  dialogOf(world).getByLabel("Players", { exact: true });

// What a scenario last wrote in the box, to hold what is left in it to.
const written = new WeakMap<SpecWorld, string>();

// Beside Add Player ---------------------------------------------------------------

const buttonsOfTheTab = (world: SpecWorld): Locator =>
  tabPanel(world).locator("section > p button");

Then(
  "the button after {string} is {string}",
  async function (this: SpecWorld, before: string, after: string) {
    await eventually(this, async () => {
      const names = (await buttonsOfTheTab(this).allInnerTexts()).map((words) =>
        words.trim(),
      );
      assert.equal(names[names.indexOf(before) + 1], after);
    });
  },
);

Then("{string} is not offered", async function (this: SpecWorld, name: string) {
  await tabPanel(this).waitFor();
  assert.equal(
    await buttonsOfTheTab(this)
      .filter({ hasText: new RegExp(`^${name}$`) })
      .count(),
    0,
  );
});

When("the way to add players is pressed", async function (this: SpecWorld) {
  await buttonsOfTheTab(this).nth(1).click();
});

// What is written ---------------------------------------------------------------

// The lines as the reader would paste them, from a spreadsheet or an entry form.
Given(
  "these lines are typed as the {string}:",
  async function (this: SpecWorld, label: string, lines: string) {
    assert.equal(label, "Players");
    written.set(this, lines);
    await box(this).fill(lines);
  },
);

Then(
  "{string} takes several lines",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await dialogOf(this)
        .getByLabel(label, { exact: true })
        .evaluate((element: { tagName: string }) => element.tagName),
      "TEXTAREA",
    );
  },
);

Then(
  "{string} says the lines it was given",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(
        await dialogOf(this).getByLabel(label, { exact: true }).inputValue(),
        written.get(this),
      );
    });
  },
);

// What was refused, line by line -----------------------------------------------

const refusedOn = (world: SpecWorld, code: string, line: number): Locator =>
  dialogOf(world).locator(
    `.field-message [data-code="${code}"][data-line="${String(line)}"]`,
  );

Then(
  "{string} is refused with {string} on line {int}",
  async function (this: SpecWorld, _label: string, code: string, line: number) {
    await eventually(this, async () => {
      assert.equal(
        await refusedOn(this, code, line).count(),
        1,
        `${code} is not said of line ${String(line)}.`,
      );
    });
  },
);

Then(
  "{string} is not refused on line {int}",
  async function (this: SpecWorld, _label: string, line: number) {
    // Waited for what is refused elsewhere first, so that nothing refused yet
    // is not taken for nothing refused at all.
    await dialogOf(this).locator(".field-message span").first().waitFor();
    assert.equal(
      await dialogOf(this)
        .locator(`.field-message [data-line="${String(line)}"]`)
        .count(),
      0,
    );
  },
);

// What was kept ------------------------------------------------------------------

const namesOf = async (
  world: SpecWorld,
  tournament: string,
): Promise<readonly string[]> =>
  (await load(world, tournamentNamed(world, tournament))).players.map(
    (player) => player.name.toString(),
  );

Then(
  "the player {string} of {string} comes before the player {string}",
  async function (
    this: SpecWorld,
    first: string,
    tournament: string,
    second: string,
  ) {
    await eventually(this, async () => {
      const names = await namesOf(this, tournament);
      assert.ok(names.includes(first) && names.includes(second));
      assert.ok(names.indexOf(first) < names.indexOf(second));
    });
  },
);

Then(
  "the Players tab lists the player {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this)
          .locator(".listed-name")
          .filter({ hasText: new RegExp(`^${name}$`) })
          .count(),
        1,
      );
    });
  },
);

Then(
  "the player {string} of {string} has no handicap",
  async function (this: SpecWorld, name: string, tournament: string) {
    await eventually(this, async () => {
      const players = (await load(this, tournamentNamed(this, tournament)))
        .players;
      const player = players.find((each) => each.name.toString() === name);
      assert.ok(player !== undefined, `${tournament} has no player ${name}.`);
      assert.equal(player.handicap, undefined);
    });
  },
);
