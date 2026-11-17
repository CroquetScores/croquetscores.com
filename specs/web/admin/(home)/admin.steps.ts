import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarkedWithin } from "../../support/marks.js";
import { closes, opens } from "../../support/languages.js";
import type { WebWorld } from "../../support/world.js";

// Once the admin has drawn a heading, which every screen of it has, whether it
// is the screen asked for or what is said in its place: until then there are
// no words of the admin's to read.
Then(
  "every word in the admin's content is in the test locale",
  async function (this: WebWorld) {
    await this.browserPage.locator("main h1").first().waitFor();
    const stray = await unmarkedWithin(this, "main");
    assert.deepEqual(stray, [], "Words in the admin came from elsewhere.");
  },
);

// The text rather than the panel's edge, since that is what the bars line up
// with (LAYOUT.md §3). Where there is no panel there is no text in one, and the
// step times out waiting for it, which is the failure wanted.
Then(
  "the site name starts at the same left edge as the text in the panel",
  async function (this: WebWorld) {
    const leftOf = async (selector: string): Promise<number> => {
      const box = await this.browserPage.locator(selector).boundingBox();
      assert.ok(box !== null, `Nothing on the page is "${selector}".`);
      return Math.round(box.x);
    };
    assert.equal(
      await leftOf("header .site-name"),
      await leftOf(".panel > :first-child"),
    );
  },
);

Then(
  "the footer reaches the bottom of the window",
  async function (this: WebWorld) {
    const box = await this.browserPage.locator("footer").boundingBox();
    assert.ok(box !== null, "The page has no footer.");
    const height = this.browserPage.viewportSize()!.height;
    assert.ok(
      Math.round(box.y + box.height) >= height,
      `The footer ends ${String(Math.round(box.y + box.height))} pixels down a window ${String(height)} tall.`,
    );
  },
);

// The name of the site in the tab, which is the page's own name and never the
// words of the language, so it is read as it stands. Nothing in the tab but
// the site's name and what comes after says it is the admin.
Then(
  "the tab names the site {string}",
  async function (this: WebWorld, siteName: string) {
    const title = await this.browserPage.title();
    assert.ok(title.includes(siteName), `The tab says "${title}".`);
  },
);

// The admin's own word in the tab, after the site's name, which is nobody's
// language and so is not marked.
Then(
  "the tab names the admin in the test locale",
  async function (this: WebWorld) {
    const title = await this.browserPage.title();
    const admin = `${opens}Admin${closes}`;
    assert.ok(title.endsWith(admin), `The tab says "${title}".`);
  },
);
