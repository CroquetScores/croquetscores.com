import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { english } from "../../../../../../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { request } from "../../../../../../../public/rankings/theFile.js";
import { unmarked } from "../../../../../../../support/languages.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  openTab,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// Read from the tab's own panel, in the words English gives each key with the
// test locale's marks taken off, so that a step says the same thing whatever
// language the page is in.

When(
  /^the rankings of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "rankings");
  },
);

const wordsOf = (key: string): string => {
  const said = english.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

Then(
  "the tab does not say the words for {string}",
  async function (this: SpecWorld, key: string) {
    const shown = unmarked(await tabPanel(this).innerText());
    assert.ok(
      !shown.includes(wordsOf(key)),
      `The tab says ${JSON.stringify(shown)}.`,
    );
  },
);

const linkCalled = (world: SpecWorld, name: string) =>
  tabPanel(world).getByRole("link", { name, exact: true });

Then(
  "the tab's link {string} is offered",
  async function (this: SpecWorld, name: string) {
    assert.equal(await linkCalled(this, name).count(), 1);
  },
);

Then(
  "the tab's link {string} leads to {string}",
  async function (this: SpecWorld, name: string, path: string) {
    assert.equal(await linkCalled(this, name).getAttribute("href"), path);
  },
);

Then(
  "the tab's link {string} is at least {int} pixels tall",
  async function (this: SpecWorld, name: string, pixels: number) {
    const box = await linkCalled(this, name).boundingBox();
    assert.ok(box !== null, `The link ${name} is not laid out.`);
    assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
  },
);

// Followed as a request of its own, since a file is saved rather than shown,
// and the browser has no page to leave for it.
When(
  "the tab's link {string} is followed",
  async function (this: SpecWorld, name: string) {
    const href = await linkCalled(this, name).getAttribute("href");
    assert.ok(href !== null, `The link ${name} leads nowhere.`);
    await request(this, href);
  },
);

Then(
  "every word in the tab is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "#tab-panel", []);
    assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
  },
);
