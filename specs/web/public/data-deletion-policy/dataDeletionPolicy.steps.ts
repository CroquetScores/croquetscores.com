import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { join } from "node:path";

import {
  helpLibraryIn,
  helpLibraryWithout,
} from "../../../../src/web/common/helpLibrary.js";
import type { SpecWorld } from "../../../support/world.js";
import { anApplicationWithHelp } from "../../support/browser.js";
import { look, lookOn, lookedAt } from "../../support/lookedAt.js";

const dist = join(import.meta.dirname, "..", "..", "..", "..", "dist", "help");

Given(
  "the help has no Welsh data deletion policy",
  async function (this: SpecWorld) {
    const without = helpLibraryWithout(
      helpLibraryIn(dist),
      "cy",
      "data-deletion-policy",
    );
    lookOn(this, await anApplicationWithHelp(this, without));
  },
);

When("the data deletion policy is opened", async function (this: SpecWorld) {
  await look(this, "/data-deletion-policy");
});

Then("the page is the data deletion policy", function (this: SpecWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="data-deletion-policy"/,
  );
});

Then("the policy is in English", function (this: SpecWorld) {
  assert.match(lookedAt(this), /<article class="help" lang="en"/);
});

Then(
  "the policy links to {string}",
  function (this: SpecWorld, address: string) {
    assert.ok(
      lookedAt(this).includes(`href="${address}"`),
      `The policy does not link to ${address}.`,
    );
  },
);

Then(
  "the policy links to send email to the administrator",
  function (this: SpecWorld) {
    assert.match(
      lookedAt(this),
      /<\/article>\s*<p>[^<]*: <a href="mailto:(\S+@\S+)">\1<\/a><\/p>/,
    );
  },
);
