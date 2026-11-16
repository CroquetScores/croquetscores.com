import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";

// Still there once the page has settled: a refresh that was going to happen
// would have happened by then.
Then("the register page is shown", async function (this: SpecWorld) {
  await this.browserPage.waitForLoadState("networkidle");
  assert.equal(new URL(this.browserPage.url()).pathname, "/account/register");
});
