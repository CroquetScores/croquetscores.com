import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  openTab,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The words exactly, rather than any row whose title holds them: "Lunch" is
// in "Lunch is at noon".
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const rows = (world: SpecWorld): Locator =>
  tabPanel(world).locator(".listed-item");

const rowOf = (world: SpecWorld, title: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".listed-name", { hasText: exactly(title) }),
  });

When(
  /^the notes of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "notes");
  },
);

Then(
  "the note {string} is listed",
  async function (this: SpecWorld, title: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, title).count(), 1);
    });
  },
);

Then(
  "the note {string} is not listed",
  async function (this: SpecWorld, title: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, title).count(), 0);
    });
  },
);

Then(
  "the first note listed is {string}",
  async function (this: SpecWorld, title: string) {
    await eventually(this, async () => {
      const first = rows(this).first().locator(".listed-name");
      assert.equal((await first.innerText()).trim(), title);
    });
  },
);

// The page beneath is inert while a dialog is open, so the title is pressed
// with the page as it is.
When(
  "the title of the note {string} is pressed",
  async function (this: SpecWorld, title: string) {
    await rowOf(this, title).locator(".listed-name").click();
  },
);

When(
  /^(Edit|Delete) is pressed for the note "(.*)"$/,
  async function (this: SpecWorld, option: string, title: string) {
    await rowOf(this, title)
      .locator(`button[data-action="${option.toLowerCase()}"]`)
      .click();
  },
);

Then(
  "the note {string} offers Edit before Delete",
  async function (this: SpecWorld, title: string) {
    const offered: (string | null)[] = [];
    for (const button of await rowOf(this, title)
      .locator(".listed-options button")
      .all()) {
      offered.push(await button.getAttribute("data-action"));
    }
    assert.deepEqual(offered, ["edit", "delete"]);
  },
);

Then(
  "every word in the tab but the notes' titles is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await rows(this).count()) > 0);
    });
    const stray = await unmarkedWithin(this, "#tab-panel section", [
      ".listed-name",
    ]);
    assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
  },
);
