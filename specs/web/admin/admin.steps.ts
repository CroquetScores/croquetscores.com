import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { withScripting } from "../support/browser.js";
import type { SpecWorld } from "../../support/world.js";

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
