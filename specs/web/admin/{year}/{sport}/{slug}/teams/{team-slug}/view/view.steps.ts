import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  settled,
} from "../../../../../../../support/tournamentPage.js";

// A team's page, opened at its address beneath its tournament's, and the
// players it lists. The list is drawn as the Players tab's is, so the steps
// that read its rows are that tab's (players-tab.steps.ts), and those of the
// dialog it opens the player dialog's (player.steps.ts).
//
// The page is taken as open once it has drawn its heading: the team's name,
// or what it says in its place where the reader cannot see it.

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const openTeam = async (
  world: SpecWorld,
  team: string,
  name: string,
): Promise<void> => {
  const tournament = await load(world, tournamentNamed(world, name));
  const found = tournament.teams.find((each) => each.name.toString() === team);
  assert.ok(found !== undefined, `${name} has no team ${team}.`);
  await world.browserPage.goto(
    `${world.baseUrl!}/admin/${tournament.address.toString()}/teams/${found.slug.toString()}`,
  );
  // Where the reader is sent to sign in first there is no heading of the
  // admin's to wait for, and the sign in page is what the scenario looks at.
  if (!new URL(world.browserPage.url()).pathname.startsWith("/admin/")) return;
  await world.browserPage.locator("main h1").first().waitFor();
};

// Given and When alike: Cucumber does not tell them apart.
Given(
  /^the page of the team "([^"]*)" in "([^"]*)" is open(?:ed)?$/,
  async function (this: SpecWorld, team: string, name: string) {
    await openTeam(this, team, name);
  },
);

// The page, once its list is the answer to what was asked, since the list is
// what it is opened for.
Given(
  /^the players of the team "([^"]*)" in "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, team: string, name: string) {
    await openTeam(this, team, name);
    await settled(this);
  },
);

// What the heading says ------------------------------------------------------------

const about = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .page-about");

Then(
  "the heading says {string}",
  async function (this: SpecWorld, words: string) {
    await about(this).first().waitFor();
    assert.equal(
      await about(this)
        .locator("span")
        .filter({ hasText: exactly(words) })
        .count(),
      1,
      `Beside the heading is ${await about(this).first().innerText()}.`,
    );
  },
);

Then(
  "the heading shows the flag {string}",
  async function (this: SpecWorld, flag: string) {
    await about(this).first().waitFor();
    assert.equal(
      await about(this).locator(`img[data-flag="${flag}"]`).count(),
      1,
    );
  },
);

// What the page offers, outside any dialog: nothing beneath one can be
// pressed. Once the page has drawn its heading, which is when it has decided
// what to draw, so that something missing is missing rather than to come.
const pageOffers = (world: SpecWorld, option: string): Locator =>
  world.browserPage
    .locator("main :is(a, button):not(.listed *):not(dialog *)")
    .filter({ hasText: exactly(option) });

Then(
  "the page offers {string}",
  async function (this: SpecWorld, option: string) {
    await this.browserPage.locator("main h1").first().waitFor();
    await eventually(this, async () => {
      assert.equal(await pageOffers(this, option).count(), 1);
    });
  },
);

Then(
  "the page does not offer {string}",
  async function (this: SpecWorld, option: string) {
    await this.browserPage.locator("main h1").first().waitFor();
    assert.equal(await pageOffers(this, option).count(), 0);
  },
);

// The team's name and short name are what the manager typed, and so are its
// players' names: none is anybody's language.
Then(
  "every word in the admin's content but the team's and its players' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "main", [
        "main h1",
        ".page-short",
        ".listed-name",
      ]);
      assert.deepEqual(stray, [], "Words in the admin came from elsewhere.");
    });
  },
);

Then(
  "every word in the list but the players' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#page-list section", [
        ".listed-name",
      ]);
      assert.deepEqual(stray, [], "Words in the list came from elsewhere.");
    });
  },
);
