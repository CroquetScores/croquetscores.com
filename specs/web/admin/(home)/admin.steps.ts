import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { english } from "../../../../src/web/languages/english.js";
import { withScripting } from "../../support/browser.js";
import { closes, opens } from "../../support/languages.js";
import { unmarkedWithin } from "../../support/marks.js";
import type { SpecWorld } from "../../../support/world.js";

// The admin's front door. /admin itself only sends the reader here.
const admin = "/admin/";

Given("a browser that runs scripts", async function (this: SpecWorld) {
  await withScripting(this);
});

const openAdmin = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${admin}`);
};

Given("the admin is open", openAdmin);
When("the admin is opened", openAdmin);

Then("the admin is shown", function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, admin);
});

// Named in the title rather than being the whole of it, since the tab also
// says it is the admin.
Then(
  "the tab names the site {string}",
  async function (this: SpecWorld, siteName: string) {
    const title = await this.browserPage.title();
    assert.ok(title.includes(siteName), `The tab says "${title}".`);
  },
);

// The admin's own word in the tab, after the site's name, which is nobody's
// language and so is not marked.
Then(
  "the tab names the admin in the test locale",
  async function (this: SpecWorld) {
    const title = await this.browserPage.title();
    const admin = `${opens}${english.words["admin.title"] ?? ""}${closes}`;
    assert.ok(title.endsWith(admin), `The tab says "${title}".`);
  },
);

// Once the admin has drawn a heading, which every screen of it has, whether it
// is the screen asked for or what is said in its place: until then there are
// no words of the admin's to read.
Then(
  "every word in the admin's content is in the test locale",
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
    const box = await this.browserPage.locator("footer").boundingBox();
    assert.ok(box !== null, "The page has no footer.");
    const height = this.browserPage.viewportSize()!.height;
    assert.ok(
      Math.round(box.y + box.height) >= height,
      `The footer ends ${String(Math.round(box.y + box.height))} pixels down a window ${String(height)} tall.`,
    );
  },
);
