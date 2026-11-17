// The page that starts a commentary, in a real browser. The title is typed as
// a reader types it, and the dialog submitted by its button.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";

const dialog = "section.dialog";

Then("the dialog asks for a title", async function (this: WebWorld) {
  const input = this.browserPage
    .locator(dialog)
    .getByLabel("Title", { exact: true });
  assert.equal(await input.count(), 1, "The dialog has no field for a title.");
  assert.equal(await input.getAttribute("type"), "text");
});

const typeTitle = async (world: WebWorld, title: string): Promise<void> => {
  await world.browserPage.fill(`${dialog} input[name="title"]`, title);
};

Given(
  "the title {string} is typed",
  async function (this: WebWorld, title: string) {
    await typeTitle(this, title);
  },
);

Given(
  "a title of {int} characters is typed",
  async function (this: WebWorld, length: number) {
    await typeTitle(this, "a".repeat(length));
  },
);

Given(
  "a title of {int} characters with spaces around it is typed",
  async function (this: WebWorld, length: number) {
    await typeTitle(this, `  ${"a".repeat(length)}  `);
  },
);

// Scripting is off unless a step asks for it back, so this is the same
Then(
  "the tournament {string} has a commentary with a title of {int} characters",
  async function (this: WebWorld, name: string, length: number) {
    const address = this.tournaments.get(name)?.address;
    assert.ok(
      address !== undefined,
      `No tournament called ${name} was created.`,
    );
    await this.browserPage.goto(`${this.baseUrl!}/${address}/commentaries`);
    const titles = await this.browserPage
      .locator("main .commentary-listed-title")
      .allInnerTexts();
    assert.ok(
      titles.map((each) => each.trim()).includes("a".repeat(length)),
      `It has ${JSON.stringify(titles)}.`,
    );
  },
);
