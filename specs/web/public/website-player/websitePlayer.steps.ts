import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// A player's page, drawn by the server with no scripting
// (`websitePlayer.feature`).

const lines = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-entry a");

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const line = (world: SpecWorld, text: string): Locator =>
  lines(world).filter({ hasText: exactly(text) });

Then(
  /^the (first|second) entry is "(.*)"$/,
  async function (this: SpecWorld, which: string, text: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal((await lines(this).nth(place).innerText()).trim(), text);
  },
);

Then(
  /^there (is|is not) an entry "(.*)"$/,
  async function (this: SpecWorld, which: string, text: string) {
    assert.equal(await line(this, text).count(), which === "is" ? 1 : 0);
  },
);

Then(
  /^there are (\d+) entries$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await lines(this).count(), Number(count));
  },
);

When(
  "the entry {string} is pressed",
  async function (this: SpecWorld, text: string) {
    await Promise.all([
      this.browserPage.waitForNavigation(),
      line(this, text).click(),
    ]);
    await this.browserPage.waitForLoadState();
  },
);
