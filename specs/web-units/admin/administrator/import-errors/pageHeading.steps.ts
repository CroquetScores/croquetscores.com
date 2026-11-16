// What a page of the admin is headed, as the reader sees it.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../support/world.js";

Then(
  "the page's heading is {string}",
  async function (this: SpecWorld, heading: string) {
    assert.equal(
      (await this.browserPage.locator("main h1").innerText()).trim(),
      heading,
    );
  },
);
