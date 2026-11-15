import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { closes, opens } from "../../support/languages.js";

// A link of the footer's row of links, by the words it is called.
const linkCalled = (world: SpecWorld, words: string) =>
  world.browserPage
    .locator("footer.site-footer .site-footer-links a")
    .filter({ hasText: words });

Then(
  "the footer link {string} leads to {string}",
  async function (this: SpecWorld, words: string, address: string) {
    assert.equal(await linkCalled(this, words).getAttribute("href"), address);
  },
);

Then(
  "the footer link {string} is in the test locale",
  async function (this: SpecWorld, words: string) {
    const shown = (await linkCalled(this, words).innerText()).trim();
    assert.ok(shown.startsWith(opens) && shown.endsWith(closes), shown);
  },
);

When(
  "the footer link {string} is followed",
  async function (this: SpecWorld, words: string) {
    await linkCalled(this, words).click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the footer link {string} is at least {int} pixels tall",
  async function (this: SpecWorld, words: string, pixels: number) {
    const box = await linkCalled(this, words).boundingBox();
    assert.ok(box !== null, `${words} is not on the page.`);
    assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
  },
);
