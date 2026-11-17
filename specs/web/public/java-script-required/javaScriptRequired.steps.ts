import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarked } from "../../support/languages.js";
import type { WebWorld } from "../../support/world.js";

const javaScriptRequired = "/account/java-script-required";

When(
  "the java script required page is opened",
  async function (this: WebWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${javaScriptRequired}`);
  },
);

// Arrived at, by whatever way: the refresh that sends a reader without
// scripting there happens once the page it is in has loaded, so this waits for
// the address to change rather than looking straight away.
Then("the java script required page is shown", async function (this: WebWorld) {
  await this.browserPage.waitForURL(`**${javaScriptRequired}`);
});

// Still there once the page has settled: a refresh that was going to happen
// would have happened by then.
Then("the register page is shown", async function (this: WebWorld) {
  await this.browserPage.waitForLoadState("networkidle");
  assert.equal(new URL(this.browserPage.url()).pathname, "/account/register");
});

Then(
  "the reader is told registering needs scripting switched on",
  async function (this: WebWorld) {
    const said =
      "Registering needs scripting switched on for this site, so that it can check that whoever is registering is a person. Switch it on, then register again.";
    const content =
      (await this.browserPage.locator("main").textContent()) ?? "";
    assert.ok(unmarked(content).includes(said), "The page does not say why.");
  },
);

const offersAWayTo = async (world: WebWorld, path: string): Promise<void> => {
  const links = world.browserPage.locator(`main a[href="${path}"]`);
  assert.ok((await links.count()) > 0, `The page offers no way to ${path}.`);
};

Then(
  "the page offers a way to the register page",
  async function (this: WebWorld) {
    await offersAWayTo(this, "/account/register");
  },
);

Then("the page offers a way to the home page", async function (this: WebWorld) {
  await offersAWayTo(this, "/");
});
