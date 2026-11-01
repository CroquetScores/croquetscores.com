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
  retried,
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

// What is drawn in the dialog ------------------------------------------------------

// A caption that is hidden is still in the page, for a screen reader, but is
// no larger than a point.
Then("the players dialog draws no caption", async function (this: SpecWorld) {
  const size = await dialogOf(this).locator(".field-label").boundingBox();
  assert.ok(size === null || (size.width <= 1 && size.height <= 1));
});

Then(
  "the players dialog draws no explanation",
  async function (this: SpecWorld) {
    assert.equal(await dialogOf(this).locator(".field-explanation").count(), 0);
  },
);

Then(
  "the players dialog is {int} pixels wide",
  async function (this: SpecWorld, width: number) {
    const size = await dialogOf(this).boundingBox();
    assert.ok(size !== null);
    assert.ok(Math.abs(size.width - width) <= 1, `It is ${size.width} wide.`);
  },
);

Then(
  "the players dialog is {int} pixels from the left of the window",
  async function (this: SpecWorld, left: number) {
    const size = await dialogOf(this).boundingBox();
    assert.ok(size !== null);
    assert.ok(Math.abs(size.x - left) <= 1, `It is ${size.x} from it.`);
  },
);

// The help icon -------------------------------------------------------------------

// The last dialog open, since one that tells the reader something is opened
// over the one that sent it and is the one being read.
const helpIcon = (world: SpecWorld): Locator =>
  dialogOf(world).locator("a.dialog-help").last();

Then(
  "the players dialog has a help icon called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await dialogOf(this).getByRole("link", { name, exact: true }).count(),
      1,
    );
  },
);

Then(
  "the help icon leads to {string}",
  async function (this: SpecWorld, address: string) {
    assert.equal(await helpIcon(this).getAttribute("href"), address);
  },
);

// The link inside a refusal's words, which is not the help icon in the title bar.
const refusalLink = (world: SpecWorld): Locator =>
  dialogOf(world).locator(".field-message a");

Then(
  "the refusal's link leads to {string}",
  async function (this: SpecWorld, address: string) {
    await eventually(this, async () => {
      assert.equal(await refusalLink(this).getAttribute("href"), address);
    });
  },
);

Then("the refusal's link opens another tab", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await refusalLink(this).getAttribute("target"), "_blank");
  });
});

Then("the help icon opens another tab", async function (this: SpecWorld) {
  assert.equal(await helpIcon(this).getAttribute("target"), "_blank");
});

Then(
  "the help icon is level with the dialog's title",
  async function (this: SpecWorld) {
    const icon = await helpIcon(this).boundingBox();
    const title = await dialogOf(this).locator(".dialog-title").boundingBox();
    assert.ok(icon !== null && title !== null, "One of them is not drawn.");
    assert.ok(
      icon.y >= title.y && icon.y + icon.height <= title.y + title.height,
    );
  },
);

Then(
  "the page has the section {string} with the bookmark {string}",
  async function (this: SpecWorld, heading: string, bookmark: string) {
    assert.equal(
      (
        (await this.browserPage.locator(`h2#${bookmark}`).textContent()) ?? ""
      ).trim(),
      heading,
    );
  },
);

// The page is scrolled to the section by its address, and the pinned bar is
// over the top of the window, so the section must stop beneath it.
Then(
  "the section {string} is below the pinned bar",
  async function (this: SpecWorld, heading: string) {
    await retried(async () => {
      const section = await this.browserPage
        .getByRole("heading", { name: heading, exact: true })
        .boundingBox();
      const bar = await this.browserPage.locator(".site-bar").boundingBox();
      assert.ok(section !== null && bar !== null, "One is not drawn.");
      assert.ok(
        section.y >= bar.y + bar.height,
        `The section is at ${String(section.y)}, the bar ends at ${String(bar.y + bar.height)}.`,
      );
    });
  },
);

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

// Looked for only once the tab has drawn its list of players, which is after it
// knows what the reader may do: before then a button that is not there is not
// there for want of the tab, and would be taken for one rightly kept away.
Then("{string} is not offered", async function (this: SpecWorld, name: string) {
  await tabPanel(this).locator(".listed, .listed-none").first().waitFor();
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

// A list as long as the scenario says, a player to a line, under the one field
// every list needs.
Given(
  "a list of {int} players is typed as the {string}",
  async function (this: SpecWorld, count: number, label: string) {
    assert.equal(label, "Players");
    const lines = [
      "Name",
      ...Array.from(
        { length: count },
        (_, each) => `Player ${String(each + 1)}`,
      ),
    ].join("\n");
    written.set(this, lines);
    await box(this).fill(lines);
  },
);

// What is written ---------------------------------------------------------------

// The lines as the reader would paste them, from a spreadsheet or an entry form.
Given(
  "these lines are typed as the {string}:",
  async function (this: SpecWorld, label: string, text: string) {
    assert.equal(label, "Players");
    // A tab is written \t, since an editor turns a real one into spaces.
    const lines = text.replace(/\\t/g, "\t");
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
  "{string} is refused once with {string}",
  async function (this: SpecWorld, _label: string, code: string) {
    await eventually(this, async () => {
      assert.equal(
        await dialogOf(this)
          .locator(`.field-message [data-code="${code}"]`)
          .count(),
        1,
        `${code} is not said once.`,
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
