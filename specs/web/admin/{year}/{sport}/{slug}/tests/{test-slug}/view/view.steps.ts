import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import { testNamed } from "../../../../../../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import { eventually } from "../../../../../../../support/tournamentPage.js";
import { daysOf } from "../../../view/tabs/tests/tests-tab.steps.js";

// A test's page, opened at its address beneath its tournament's. Its scores
// are listed as a competition's Scores tab lists them, so the steps that read
// them are that tab's (scores-tab.steps.ts), and those of the dialog it opens
// the score dialog's (score-modal-dialog.steps.ts).
//
// The page is taken as open once it has drawn its heading: the test's name,
// or what it says in its place where the reader cannot see it.

Given(
  /^the page of the test "([^"]*)" in "([^"]*)" is open(?:ed)?$/,
  async function (this: SpecWorld, test: string, name: string) {
    const tournament = await load(this, tournamentNamed(this, name));
    const { reference } = testNamed(tournament, test);
    await this.browserPage.goto(
      `${this.baseUrl!}/admin/${tournament.address.toString()}/tests/${reference.slug.toString()}`,
    );
    // Where the reader is sent to sign in first there is no heading of the
    // admin's to wait for, and the sign in page is what the scenario looks at.
    if (!new URL(this.browserPage.url()).pathname.startsWith("/admin/")) {
      return;
    }
    await this.browserPage.locator("main h1").first().waitFor();
  },
);

// What is said beneath the heading -----------------------------------------------

const about = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .page-about");

Then(
  "the page names the team {string}",
  async function (this: SpecWorld, team: string) {
    await eventually(this, async () => {
      const named = (
        await about(this).locator(".page-team").allInnerTexts()
      ).map((each) => each.trim());
      assert.ok(named.includes(team), `It names ${JSON.stringify(named)}.`);
    });
  },
);

Then(
  "the page says the test is played on {string}",
  async function (this: SpecWorld, day: string) {
    await eventually(this, async () => {
      assert.deepEqual(await daysOf(about(this)), [day]);
    });
  },
);

Then(
  /^the page says the test is expected to have (\d+) match(?:es)?$/,
  async function (this: SpecWorld, matches: number) {
    await eventually(this, async () => {
      assert.equal(
        await about(this)
          .locator(".test-matches")
          .getAttribute("data-matches", { timeout: 500 }),
        String(matches),
      );
    });
  },
);

Then(
  "the page says each match is the best of {int}",
  async function (this: SpecWorld, games: number) {
    await eventually(this, async () => {
      assert.equal(
        await about(this)
          .locator(".test-best-of")
          .getAttribute("data-best-of", { timeout: 500 }),
        String(games),
      );
    });
  },
);

// The test's name is its teams' short names, its teams' names and its
// players' are what the manager typed, and a day's month is named by the
// browser: none is anybody's language.
Then(
  "every word in the admin's content but the test's, the teams' and the players' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "main", [
        "main h1",
        ".page-team",
        ".test-group",
        "time",
        ".listed-score",
      ]);
      assert.deepEqual(stray, [], "Words in the admin came from elsewhere.");
    });
  },
);
