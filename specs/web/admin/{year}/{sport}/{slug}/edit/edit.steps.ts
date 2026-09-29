import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  load,
  tournamentNamed,
} from "../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../support/marks.js";
import {
  changeTournament,
  keptCalled,
} from "../../../../../support/tournaments.js";

// The edit page is the new tournament form begun as the tournament is, so the
// steps that read and fill the form are the form's own (new.steps.ts). These
// are what changing a tournament adds: opening it where the tournament is, the
// tournament being something the form should begin as, and what is kept.

// Opened at the tournament's address as it is now, which is where the reader
// is sent from the list.
const openToEdit = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  const tournament = await load(this, tournamentNamed(this, name));
  await this.browserPage.goto(
    `${this.baseUrl!}/admin/${tournament.address.toString()}/edit`,
  );
};

Given("the page to edit {string} is open", openToEdit);
When("the page to edit {string} is opened", openToEdit);

When(
  "the page at {string} is opened",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

// What the tournament is before the page is opened. A tournament played under
// handicap or allowing drawn games does not count towards the world rankings,
// and one that is national is not international, since the tournament refuses
// any of those (create.feature).

Given(
  "the tournament {string} is played under handicap",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, name, {
      handicap: true,
      worldRankings: false,
    });
  },
);

Given(
  "the tournament {string} allows drawn games",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, name, {
      drawsAllowed: true,
      worldRankings: false,
    });
  },
);

Given(
  "the tournament {string} is national",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, name, {
      national: true,
      international: false,
    });
  },
);

Given(
  "the tournament {string} does not count towards the world rankings",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, name, { worldRankings: false });
  },
);

Given(
  "the tournament {string} has the notes {string}",
  async function (this: SpecWorld, name: string, notes: string) {
    await changeTournament(this, name, { notes });
  },
);

// In place of the form, by the refusal's code: the words beside it are only
// its words. Asked again for a while, since the page says it once the API has
// answered.
Then(
  "the page is refused with {string}",
  async function (this: SpecWorld, code: string) {
    const refused = this.browserPage.locator("main .page-refused");
    await refused.waitFor();
    assert.equal(await refused.getAttribute("data-refused"), code);
  },
);

Then(
  "the tournament {string} is kept with the notes {string}",
  async function (this: SpecWorld, name: string, notes: string) {
    assert.equal((await keptCalled(this, name)).notes?.markdown, notes);
  },
);

// The notes are the manager's words, in a box of their own, and the regions are
// left as they were recorded (new.feature), so neither is read for marks.
// Once the form is drawn and its lists filled, which is once the country the
// tournament is in is chosen in its list.
Then(
  "every word in the form but the notes and the regions is in the test locale",
  async function (this: SpecWorld) {
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
