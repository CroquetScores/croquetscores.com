// The page where an administrator judges a national or an international
// tournament (notableTournament.feature), in a real browser. What it shows is
// filled in once the API has answered, so every step waits for what it looks
// at. The dialog it asks in is the modal dialog's, whose steps are shared
// (modalDialog.ts).
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const buttonCalled = (world: SpecWorld, words: string): Locator =>
  world.browserPage.locator("main button").filter({ hasText: exactly(words) });

// Opened as a reader opens it, without keeping what the server answered: the
// scenarios that open it first are not about the answer.
Given(
  "the page at {string} is open",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

Then(
  "the page names the tournament {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(async () => {
      assert.equal(
        (
          await this.browserPage
            .locator("main .notable-tournament-name")
            .innerText({ timeout: 100 })
        ).trim(),
        name,
      );
    });
  },
);

Then(
  /^the page's link to the (tournament|admin tournament) leads to "([^"]*)"$/,
  async function (this: SpecWorld, which: string, address: string) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator(
            `main a[data-link="${which === "tournament" ? "tournament" : "admin-tournament"}"]`,
          )
          .getAttribute("href", { timeout: 100 }),
        address,
      );
    });
  },
);

Then(
  "the page has the button {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      assert.equal(await buttonCalled(this, words).count(), 1);
    });
  },
);

// Asked once the page has something to show, so that a button not yet drawn is
// not taken for one that is not offered.
Then(
  "the page has no button {string}",
  async function (this: SpecWorld, words: string) {
    await this.browserPage
      .locator("main [data-none]")
      .waitFor({ timeout: 3000 });
    assert.equal(await buttonCalled(this, words).count(), 0);
  },
);

When(
  "the page's button {string} is pressed",
  async function (this: SpecWorld, words: string) {
    await buttonCalled(this, words).click();
  },
);

Then(
  "the page says the tournament is neither national nor international",
  async function (this: SpecWorld) {
    await this.browserPage
      .locator("main [data-none]")
      .waitFor({ timeout: 3000 });
  },
);

Then(
  "the page says it is refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("main [data-refused]")
          .getAttribute("data-refused", { timeout: 100 }),
        code,
      );
    });
  },
);
