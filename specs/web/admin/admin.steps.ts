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
