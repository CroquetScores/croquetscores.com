// The steps for a modal dialog (STYLE.md §5c), which more than one of the
// admin's pages opens: the Managers and Scorers tabs ask in one before taking
// somebody off, and the Players tab before archiving a player in competitions. Here rather than beside any one of them, since they are the
// dialog's and not the page's.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../support/world.js";
import { unmarkedWithin } from "./marks.js";

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

const buttonsOf = (world: SpecWorld): Locator =>
  dialogOf(world).locator(".dialog-buttons button");

Then(
  "the modal dialog titled {string} is open",
  async function (this: SpecWorld, title: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      (await dialogOf(this).locator(".dialog-title").innerText()).trim(),
      title,
    );
  },
);

Then(
  /^(?:no modal dialog is|the (?:player|score|competition) dialog is not) open$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor({ state: "detached" });
  },
);

Then(
  "the modal dialog names {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    const said = await dialogOf(this).locator(".dialog-content").innerText();
    assert.ok(said.includes(name), `The dialog says ${JSON.stringify(said)}.`);
  },
);

Then(
  "the modal dialog does not name {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    const said = await dialogOf(this).locator(".dialog-content").innerText();
    assert.ok(!said.includes(name), `The dialog says ${JSON.stringify(said)}.`);
  },
);

Then(
  "the modal dialog names {string} before {string}",
  async function (this: SpecWorld, first: string, second: string) {
    await dialogOf(this).waitFor();
    const said = await dialogOf(this).locator(".dialog-content").innerText();
    assert.ok(
      said.includes(first) &&
        said.includes(second) &&
        said.indexOf(first) < said.indexOf(second),
      `The dialog says ${JSON.stringify(said)}.`,
    );
  },
);

const places = ["first", "second"];

Then(
  /^the (?:modal|player|score|competition) dialog's (first|second) button is "([^"]*)"$/,
  async function (this: SpecWorld, place: string, words: string) {
    await dialogOf(this).waitFor();
    const all = (await buttonsOf(this).allInnerTexts()).map((each) =>
      each.trim(),
    );
    assert.equal(
      all[places.indexOf(place)],
      words,
      `The buttons are ${JSON.stringify(all)}.`,
    );
  },
);

When(
  "{string} is pressed in the modal dialog",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).waitFor();
    await buttonsOf(this)
      .filter({ hasText: new RegExp(`^${words}$`) })
      .click();
  },
);

// Somebody's name is theirs, and nobody's language; it is filled into the
// dialog's words, and read inside their marks with them. A competition's name
// is its manager's, and is listed in the dialog on its own.
Then(
  /^every word in the modal dialog but the (?:scorer|manager)'s name is in the test locale$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

Then(
  "every word in the modal dialog but the player's and the competitions' names is in the test locale",
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open, ["[data-names] li"]);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);
