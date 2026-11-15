// What a tournament's pages share as a scenario says it: how a competition's
// page is headed, which section of the bar is the one being read, and which of
// its words are the site's and which are the tournament's own.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarkedWithin } from "./marks.js";
import type { WebWorld } from "./world.js";

// The sections the site's bar offers, found by their words.
const section = (label: string): string =>
  `.site-sections a:text-is("${label}")`;

When(
  "the section {string} is pressed",
  async function (this: WebWorld, label: string) {
    await this.browserPage.locator(".site-sections").waitFor();
    await this.browserPage.click(section(label));
  },
);

Then(
  "the section {string} is marked as current",
  async function (this: WebWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      "page",
    );
  },
);

Then(
  "the section {string} is not marked as current",
  async function (this: WebWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      null,
    );
  },
);

// A competition's page is headed by the tournament's name, a first-level heading
// said aloud and not seen, and the competition's name beneath it, the second.
Then(
  "the competition is headed {string}",
  async function (this: WebWorld, name: string) {
    const heading = this.browserPage.locator("main h2").first();
    await heading.waitFor();
    assert.equal((await heading.innerText()).trim(), name);
  },
);

// The tournament's own words are left out, on its page, its players' page, a
// player's and a block's alike: its name, its players' names, their initials and
// what they represent, its competitions' names and the scores, which are what
// whoever entered them typed, and the day a game was added, which is numbers and
// a month the browser names.
Then(
  "every word in the page's content but the tournament's own is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "main", [
      "main h1",
      // The competition's name, as the tournament's is, and the script that
      // shows the print button, which is not words.
      ".competition-heading h2",
      "main script",
      ".game-name",
      ".game-representing",
      ".game-score",
      ".game-competition",
      ".game-day",
      ".player-name",
      ".player-representing",
      ".player-game-opponent",
      ".player-competition",
      ".block-grid-initials",
      ".block-grid-points",
      ".swiss-result-opponent",
      ".team-summary-team",
      ".team-summary-corner",
      ".test-team",
      ".test-side",
      ".test-score",
      ".players-team-name",
      ".player-game-team",
      ".rankings-tournament",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

When("the browser goes back", async function (this: WebWorld) {
  await this.browserPage.goBack();
});

Then(
  "the header names the tournament {string}",
  async function (this: WebWorld, name: string) {
    assert.equal(
      (
        await this.browserPage
          .locator("header.site-bar .site-tournament")
          .innerText()
      ).trim(),
      name,
    );
  },
);

Then(
  "the section {string} leads to {string}",
  async function (this: WebWorld, label: string, path: string) {
    await this.browserPage.locator(".site-sections").waitFor();
    assert.equal(
      await this.browserPage.getAttribute(section(label), "href"),
      path,
    );
  },
);

Then(
  "the page is headed {string}",
  async function (this: WebWorld, name: string) {
    const heading = this.browserPage.locator("main h1").first();
    await heading.waitFor();
    assert.equal((await heading.innerText()).trim(), name);
  },
);

Then("the page's content has no main heading", async function (this: WebWorld) {
  await this.browserPage.locator("main").waitFor();
  assert.equal(await this.browserPage.locator("main h1").count(), 0);
});
