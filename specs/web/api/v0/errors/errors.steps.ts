// What the API says when it has nothing to give (errors.feature). Refusals of a
// request are asked of the routes that make them, in their own features.
import { When } from "@cucumber/cucumber";

import type { WebWorld } from "../../../support/world.js";
import { asked, bearer, keyMade } from "../apiOfApps.js";

When("the API is asked for its own address", async function (this: WebWorld) {
  await asked(this, "/api/v0", bearer(keyMade(this)));
});

When(
  "the API is asked for an address there is nothing at",
  async function (this: WebWorld) {
    await asked(this, "/api/v0/nothing-here", bearer(keyMade(this)));
  },
);
