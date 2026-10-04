// The section bar of a tournament's page and its competitions' pages, in a
// real browser. The admin draws the bar once it knows the competitions, so
// every step waits for it before looking: a bar looked at too soon is not yet
// there, and would read as one with nothing in it.
//
// Whether a section is marked as the page being read is asked as the public
// side's section bar is (navigation.steps.ts), since it is the same bar.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../../support/world.js";
import { isMarked } from "../../../../support/marks.js";

const bar = "nav.site-sections";
const sections = `${bar} a`;
const section = (label: string): string => `${sections}:text-is("${label}")`;
const places = ["first", "second", "third", "fourth", "fifth", "sixth"];

const drawn = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.locator(bar).waitFor();
};

const labels = async (world: SpecWorld): Promise<string[]> => {
  await drawn(world);
  return world.browserPage.locator(sections).allTextContents();
};

Then("the page has a section bar", async function (this: SpecWorld) {
  await drawn(this);
});

Then(
  "the section {string} is offered",
  async function (this: SpecWorld, label: string) {
    assert.ok(
      (await labels(this)).includes(label),
      `The section bar offers ${JSON.stringify(await labels(this))}.`,
    );
  },
);

Then(
  "the section {string} is not offered",
  async function (this: SpecWorld, label: string) {
    assert.ok(
      !(await labels(this)).includes(label),
      `The section bar offers ${JSON.stringify(await labels(this))}.`,
    );
  },
);

Then(
  /^(\d+) sections? (?:is|are) offered$/,
  async function (this: SpecWorld, count: string) {
    assert.equal((await labels(this)).length, Number(count));
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth) section is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, label: string) {
    assert.equal((await labels(this))[places.indexOf(which)], label);
  },
);

Then(
  "the first section is in the test locale",
  async function (this: SpecWorld) {
    const [first] = await labels(this);
    assert.ok(
      first !== undefined && isMarked(first),
      `The first section is ${JSON.stringify(first)}.`,
    );
  },
);

Then(
  "the section {string} leads to {string}",
  async function (this: SpecWorld, label: string, path: string) {
    await drawn(this);
    assert.equal(
      await this.browserPage.getAttribute(section(label), "href"),
      path,
    );
  },
);

When(
  "the section {string} is pressed",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await this.browserPage.click(section(label));
  },
);

Then(
  "the section {string} is at least {int} pixels tall",
  async function (this: SpecWorld, label: string, pixels: number) {
    await drawn(this);
    const box = await this.browserPage.locator(section(label)).boundingBox();
    assert.ok(box !== null, `The section ${label} is not laid out.`);
    assert.ok(
      box.height >= pixels,
      `The section ${label} is ${Math.round(box.height)} pixels tall, and wanted ${pixels}.`,
    );
  },
);
