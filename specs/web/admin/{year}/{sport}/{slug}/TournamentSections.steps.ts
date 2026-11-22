// The section bar of a tournament's page and its competitions' pages, in a
// real browser. The admin draws the bar once it knows the competitions, so
// every step waits for it before looking: a bar looked at too soon is not yet
// there, and would read as one with nothing in it.
//
// Whether a section is marked as the page being read is asked as the public
// side's section bar is (navigation.steps.ts), since it is the same bar.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../../support/world.js";

const bar = "nav.site-sections";
const sections = `${bar} a`;
const section = (label: string): string => `${sections}:text-is("${label}")`;
const drawn = async (world: WebWorld): Promise<void> => {
  await world.browserPage.locator(bar).waitFor();
};

Then(
  "the section {string} is at least {int} pixels tall",
  async function (this: WebWorld, label: string, pixels: number) {
    await drawn(this);
    const box = await this.browserPage.locator(section(label)).boundingBox();
    assert.ok(box !== null, `The section ${label} is not laid out.`);
    assert.ok(
      box.height >= pixels,
      `The section ${label} is ${Math.round(box.height)} pixels tall, and wanted ${pixels}.`,
    );
  },
);

Then(
  "the section {string} is at most {int} pixels wide",
  async function (this: WebWorld, label: string, pixels: number) {
    await drawn(this);
    const box = await this.browserPage.locator(section(label)).boundingBox();
    assert.ok(box !== null, `The section ${label} is not laid out.`);
    assert.ok(
      box.width <= pixels,
      `The section ${label} is ${Math.round(box.width)} pixels wide, and wanted at most ${pixels}.`,
    );
  },
);
