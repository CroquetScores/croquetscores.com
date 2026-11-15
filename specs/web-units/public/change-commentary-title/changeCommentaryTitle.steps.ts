// The pencil beside a commentary's title, in a real browser. The page it
// leads to is a dialog, typed in and sent as the page that starts a
// commentary is (startCommentary.steps.ts).
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

const pencilOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .commentary-title-edit");

// Drawn as a pencil, and named for a reader who cannot see it.
Then(
  "the way to change the commentary's title is a pencil named {string}",
  async function (this: SpecWorld, name: string) {
    const pencil = pencilOf(this);
    assert.equal(await pencil.locator(".icon-pencil").count(), 1);
    assert.equal(
      await this.browserPage
        .locator("main .commentary-heading")
        .getByRole("link", { name, exact: true })
        .count(),
      1,
    );
  },
);

// On the title's line and past its end, where a reader comes to it after
// reading the title.
Then(
  "the way to change the commentary's title is to the right of the title",
  async function (this: SpecWorld) {
    const title = await this.browserPage
      .locator("main .commentary-title")
      .boundingBox();
    const pencil = await pencilOf(this).boundingBox();
    assert.ok(title !== null && pencil !== null, "One of them is not drawn.");
    assert.ok(
      pencil.x >= title.x + title.width,
      "The pencil is not to the right of the title.",
    );
    assert.ok(
      pencil.y < title.y + title.height && pencil.y + pencil.height > title.y,
      "The pencil is not on the title's line.",
    );
  },
);

Then(
  "the way to change the commentary's title leads to {string}",
  async function (this: SpecWorld, path: string) {
    assert.equal(await pencilOf(this).getAttribute("href"), path);
  },
);

Then(
  "the page offers no way to change the commentary's title",
  async function (this: SpecWorld) {
    assert.equal(await pencilOf(this).count(), 0);
  },
);
