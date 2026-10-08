// The page where an administrator reads the documents the import refused
// (importErrors.feature), in a real browser. The rows are filled in once the
// API has answered, so every step waits for what it looks at.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { isMarked } from "../../../support/marks.js";

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

const PLACES = ["first", "second"];
const PLACE = "(first|second)";

const rows = (world: SpecWorld): Locator =>
  world.browserPage.locator("main ul.import-errors > li > a.import-error");

const rowAt = (world: SpecWorld, place: string): Locator =>
  rows(world).nth(PLACES.indexOf(place));

Then(
  new RegExp(`^the ${PLACE} row's document id is "([^"]*)"$`),
  async function (this: SpecWorld, place: string, documentId: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, place)
          .locator(".import-error-document")
          .innerText({ timeout: 100 }),
        documentId,
      );
    });
  },
);

Then(
  "the first row's message is {string}",
  async function (this: SpecWorld, message: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, "first")
          .locator(".import-error-first-line")
          .innerText({ timeout: 100 }),
        message,
      );
    });
  },
);

Then(
  "the first row's message does not include {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      const message = await rowAt(this, "first")
        .locator(".import-error-first-line")
        .innerText({ timeout: 100 });
      assert.ok(!message.includes(words), `The message is ${message}.`);
    });
  },
);

Then(
  "the page says there are no import errors",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage.locator("main [data-none]").count(),
        1,
      );
    });
  },
);

// Looked for once the page is drawn, which is when its heading is there, so
// that a page not yet drawn is not taken for one that does not say it.
Then(
  "the page does not say there are no import errors",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(await rows(this).count(), 1);
    });
    assert.equal(await this.browserPage.locator("main [data-none]").count(), 0);
  },
);

Then(
  "the first row leads to {string}",
  async function (this: SpecWorld, path: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, "first").getAttribute("href", { timeout: 100 }),
        path,
      );
    });
  },
);

When("the first row is pressed", async function (this: SpecWorld) {
  await rowAt(this, "first").click();
});

// The heading is a phrase from a catalogue, so it is marked at both ends in
// the test locale. Shared with the page of one document.
Then(
  "the page's heading is in the test locale",
  async function (this: SpecWorld) {
    await eventually(async () => {
      const heading = await this.browserPage
        .locator("main h1")
        .innerText({ timeout: 100 });
      assert.ok(
        isMarked(heading),
        `The heading is ${JSON.stringify(heading)}.`,
      );
    });
  },
);
