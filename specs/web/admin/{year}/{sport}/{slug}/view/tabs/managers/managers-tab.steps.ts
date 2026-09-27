import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { english } from "../../../../../../../../../src/web/languages/english.js";
import {
  accountFor,
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarked } from "../../../../../../../support/languages.js";
import {
  eventually,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// What the Managers tab adds to the Scorers tab's steps (people.ts): the
// reader's own name, and what taking themselves off says and does.

const readerIs = async (world: SpecWorld, name: string): Promise<boolean> => {
  const row = tabPanel(world)
    .locator('ul[data-listed="managers"] > .listed-item')
    .filter({
      has: world.browserPage.locator(".listed-name", { hasText: name }),
    });
  assert.equal(await row.count(), 1, `${name} is not listed.`);
  return (await row.getAttribute("data-reader")) !== null;
};

Then(
  "the manager {string} is said to be the reader",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await readerIs(this, name), true);
    });
  },
);

Then(
  "the manager {string} is not said to be the reader",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await readerIs(this, name), false);
    });
  },
);

// In whatever language the scenario reads the page in, with the test locale's
// marks taken off, so that one step serves both.
const dialogSays = async (world: SpecWorld): Promise<string> => {
  const dialog = world.browserPage.locator("dialog[open]");
  await dialog.waitFor();
  return unmarked(await dialog.locator(".dialog-content").innerText());
};

const wordsFor = (key: string): string => {
  const words = english.words[key];
  assert.ok(words !== undefined, `English has no words for ${key}.`);
  return words;
};

Then(
  "the modal dialog says the words for {string}",
  async function (this: SpecWorld, key: string) {
    const said = await dialogSays(this);
    assert.ok(said.includes(wordsFor(key)), `The dialog says ${said}.`);
  },
);

Then(
  "the modal dialog does not say the words for {string}",
  async function (this: SpecWorld, key: string) {
    const said = await dialogSays(this);
    assert.ok(!said.includes(wordsFor(key)), `The dialog says ${said}.`);
  },
);

// As the tournament is kept, once the reader has been taken back to their
// list: the tab no longer shows it to them.
Then(
  "the account for {string} does not manage {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await this.browserPage.waitForURL((url) => url.pathname === "/admin/");
    const tournament = await load(this, tournamentNamed(this, name));
    assert.equal(tournament.manages(await accountFor(this, address)), false);
  },
);
