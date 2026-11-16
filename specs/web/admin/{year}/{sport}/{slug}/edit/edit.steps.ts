import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../../../support/world.js";
import { keptCalled, keptOf } from "../../../../../support/kept.js";
import { unmarkedWithin } from "../../../../../support/marks.js";
import { changeTournament } from "../../../../../support/tournaments.js";

// The edit page is the new tournament form begun as the tournament is, so the
// steps that read and fill the form are the form's own (new.steps.ts). These
// are what changing a tournament adds: opening it where the tournament is, the
// tournament being something the form should begin as, and what is kept.

// Opened at the tournament's address as it is now, which is where the reader
// is sent from the list.
const openToEdit = async function (
  this: WebWorld,
  name: string,
): Promise<void> {
  const tournament = await keptOf(this, name);
  await this.browserPage.goto(
    `${this.baseUrl!}/admin/${tournament.address}/edit`,
  );
};

Given("the page to edit {string} is open", openToEdit);
When("the page to edit {string} is opened", openToEdit);

// What the tournament is before the page is opened. One that is national is
// not international, since the tournament refuses both (create.feature).

Given(
  "the tournament {string} is in no region",
  async function (this: WebWorld, name: string) {
    await changeTournament(this, name, { region: undefined });
  },
);

// Only a tournament played by teams draws a level test, so the scenario says
// first that it is played by teams.
Given(
  "the tournament {string} draws a level test",
  async function (this: WebWorld, name: string) {
    await changeTournament(this, name, { levelTestsDrawn: true });
  },
);

Given(
  "the tournament {string} has the subtitle {string}",
  async function (this: WebWorld, name: string, subtitle: string) {
    await changeTournament(this, name, { subtitle });
  },
);

Then(
  "the tournament {string} is kept with the subtitle {string}",
  async function (this: WebWorld, name: string, subtitle: string) {
    assert.equal((await keptCalled(this, name)).subtitle, subtitle);
  },
);

// The subtitle is the manager's words, in a box of their own, and the regions
// are left as they were recorded (new.feature), so neither is read for marks.
// Once the form is drawn and its lists filled, which is once the country the
// tournament is in is chosen in its list.
Then(
  "every word in the form but the subtitle and the regions is in the test locale",
  async function (this: WebWorld) {
    await this.browserPage
      .locator("#field-region option:checked:not([value=''])")
      .waitFor({ state: "attached" });
    const stray = await unmarkedWithin(this, "section.dialog", [
      "textarea",
      "#field-region",
    ]);
    assert.deepEqual(stray, [], "Words in the form came from elsewhere.");
  },
);
