// The page that starts a commentary, in a real browser. The title is typed as
// a reader types it, and the dialog submitted by its button.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import {
  load,
  tournamentNamed,
} from "../../../application/operations/tournaments/aRequest.js";
import { englishForScenarios } from "../../support/languages.js";

const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

Then("the dialog asks for a title", async function (this: SpecWorld) {
  const input = this.browserPage
    .locator(dialog)
    .getByLabel(words("startCommentary.titleField"), { exact: true });
  assert.equal(await input.count(), 1, "The dialog has no field for a title.");
  assert.equal(await input.getAttribute("type"), "text");
});

const typeTitle = async (world: SpecWorld, title: string): Promise<void> => {
  await world.browserPage.fill(`${dialog} input[name="title"]`, title);
};

Given(
  "the title {string} is typed",
  async function (this: SpecWorld, title: string) {
    await typeTitle(this, title);
  },
);

Given(
  "a title of {int} characters is typed",
  async function (this: SpecWorld, length: number) {
    await typeTitle(this, "a".repeat(length));
  },
);

Given(
  "a title of {int} characters with spaces around it is typed",
  async function (this: SpecWorld, length: number) {
    await typeTitle(this, `  ${"a".repeat(length)}  `);
  },
);

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
Given(
  "the page at {string} is open with scripting off",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

Then(
  "the tournament {string} has a commentary with a title of {int} characters",
  async function (this: SpecWorld, name: string, length: number) {
    const titles = (
      await load(this, tournamentNamed(this, name))
    ).commentaries.map(({ title }) => title.toString());
    assert.ok(
      titles.includes("a".repeat(length)),
      `It has ${JSON.stringify(titles)}.`,
    );
  },
);
