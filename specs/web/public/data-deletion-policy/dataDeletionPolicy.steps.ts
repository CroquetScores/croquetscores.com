import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { look, lookedAt } from "../../support/looking.js";
import type { WebWorld } from "../../support/world.js";

When("the data deletion policy is opened", async function (this: WebWorld) {
  await look(this, "/data-deletion-policy");
});

Then("the page is the data deletion policy", function (this: WebWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="data-deletion-policy"/,
  );
});

Then(
  "the policy links to {string}",
  function (this: WebWorld, address: string) {
    assert.ok(
      lookedAt(this).includes(`href="${address}"`),
      `The policy does not link to ${address}.`,
    );
  },
);

Then(
  "the policy links to send email to {string}",
  function (this: WebWorld, emailAddress: string) {
    assert.ok(
      lookedAt(this).includes(
        `<a href="mailto:${emailAddress}">${emailAddress}</a>`,
      ),
      "The administrator is not linked.",
    );
  },
);
