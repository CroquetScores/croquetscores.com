import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";
import { anApplicationServedAs } from "./browser.js";
import type { SpecWorld } from "../../support/world.js";

// A site of this scenario's own, served as the website it names, so that what
// the shell puts round a page can be seen to follow the website rather than
// anything else about the application every other scenario shares.
Given(
  "a site served as {string}",
  async function (this: SpecWorld, host: string) {
    this.baseUrl = await anApplicationServedAs(this, host);
  },
);

// The tournament named in the header -------------------------------------------------

const tournamentInHeader = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-tournament");

Then(
  "the header names the tournament {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal((await tournamentInHeader(this).innerText()).trim(), name);
  },
);

// Among the footer's links, which are for finding: the one that writes about a
// bug is asked for by its own steps below, and any other by its words.
const linksOffered = async (world: SpecWorld): Promise<string[]> => {
  const offered: string[] = [];
  for (const link of await world.browserPage
    .locator("footer.site-footer .site-footer-links a")
    .all()) {
    // One that is kept from sight is not offered, whatever words it holds.
    if (await link.isVisible()) offered.push((await link.innerText()).trim());
  }
  return offered;
};

Then(
  "the footer offers the link {string}",
  async function (this: SpecWorld, words: string) {
    assert.ok(
      (await linksOffered(this)).includes(words),
      `The footer does not offer ${words}.`,
    );
  },
);

Then(
  "the footer does not offer the link {string}",
  async function (this: SpecWorld, words: string) {
    assert.ok(
      !(await linksOffered(this)).includes(words),
      `The footer offers ${words}.`,
    );
  },
);

// Where the footer's links are ---------------------------------------------------

const footerLinks = (world: SpecWorld): Locator =>
  world.browserPage.locator("footer.site-footer .site-footer-links a");

const boxOf = async (locator: Locator, what: string) => {
  const box = await locator.boundingBox();
  assert.ok(box !== null, `${what} is not on the page.`);
  return box;
};

// A pixel or two either way is a rounding of where a box starts, not a place.
const near = (one: number, other: number): boolean =>
  Math.abs(one - other) <= 2;

Then("the footer's links are side by side", async function (this: SpecWorld) {
  // By the middle of each and not the top, since a link that is as tall as a
  // thumb needs (homeScreenLink.feature) is centred in the row with the shorter
  // ones, and starts above them without being on a row of its own.
  const tops: number[] = [];
  for (const link of await footerLinks(this).all()) {
    const box = await boxOf(link, "A link");
    tops.push(box.y + box.height / 2);
  }
  assert.equal(tops.length, 4);
  assert.ok(
    tops.every((top) => near(top, tops[0]!)),
    `The links start ${tops.join(", ")} down.`,
  );
});

Then(
  /^the (first|second|third|fourth) footer link is "([^"]*)"$/,
  async function (this: SpecWorld, place: string, words: string) {
    const at = ["first", "second", "third", "fourth"].indexOf(place);
    assert.equal((await footerLinks(this).nth(at).innerText()).trim(), words);
  },
);
