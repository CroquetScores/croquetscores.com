// What a tournament's pages share as a scenario says it: how a competition's
// page is headed, which section of the bar is the one being read, and which of
// its words are the site's and which are the tournament's own.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { isMarked } from "./marks.js";
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

// The section bar, which is drawn again a moment after something on the page
// changes what it holds, so a claim about what it offers is given a few seconds
// to come true before it is called false. A claim that is true at once costs
// nothing.
const sections = ".site-sections a";
const places = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
];

const labels = async (world: WebWorld): Promise<string[]> => {
  await world.browserPage.locator(".site-sections").waitFor();
  return world.browserPage.locator(sections).allTextContents();
};

const settles = async (
  world: WebWorld,
  holds: (found: readonly string[]) => boolean,
): Promise<void> => {
  const until = Date.now() + 5000;
  let found = await labels(world);
  while (!holds(found) && Date.now() < until) {
    await world.browserPage.waitForTimeout(100);
    found = await labels(world);
  }
  assert.ok(holds(found), `The section bar offers ${JSON.stringify(found)}.`);
};

Then(
  "the section {string} is offered",
  async function (this: WebWorld, label: string) {
    await settles(this, (found) => found.includes(label));
  },
);

Then(
  "the section {string} is not offered",
  async function (this: WebWorld, label: string) {
    await settles(this, (found) => !found.includes(label));
  },
);

Then(
  /^(\d+) sections? (?:is|are) offered$/,
  async function (this: WebWorld, count: string) {
    assert.equal((await labels(this)).length, Number(count));
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh) section is "([^"]*)"$/,
  async function (this: WebWorld, which: string, label: string) {
    await settles(this, (found) => found[places.indexOf(which)] === label);
  },
);

Then(
  "the first section is in the test locale",
  async function (this: WebWorld) {
    const [first] = await labels(this);
    assert.ok(
      first !== undefined && isMarked(first),
      `The first section is ${JSON.stringify(first)}.`,
    );
  },
);
