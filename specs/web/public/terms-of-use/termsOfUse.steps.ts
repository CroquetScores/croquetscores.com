import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { look, lookedAt } from "../../support/looking.js";
import type { WebWorld } from "../../support/world.js";

When("the terms of use are opened", async function (this: WebWorld) {
  await look(this, "/terms-of-use");
});

When(
  "the terms of use for those who write are opened",
  async function (this: WebWorld) {
    await look(this, "/admin/terms-of-use");
  },
);

Then("the page is the terms of use", function (this: WebWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="terms-of-use"/,
  );
});

Then(
  "the page is the terms of use for those who write",
  function (this: WebWorld) {
    assert.match(
      lookedAt(this),
      /<article class="help"[^>]* data-page="admin\/terms-of-use"/,
    );
  },
);

Then(
  "the terms link to the terms of use for those who write",
  function (this: WebWorld) {
    assert.match(
      lookedAt(this),
      /<article[\s\S]*<a href="\/admin\/terms-of-use">[\s\S]*<\/article>/,
    );
  },
);

Then(
  "the terms have the heading {string}",
  function (this: WebWorld, heading: string) {
    const headings = [
      ...lookedAt(this).matchAll(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/g),
    ].map((found) => found[1]);
    assert.ok(
      headings.includes(heading),
      `The terms have the headings ${JSON.stringify(headings)}.`,
    );
  },
);

Then("the footer links to the terms of use", function (this: WebWorld) {
  assert.match(
    lookedAt(this),
    /<footer[\s\S]*<a href="\/terms-of-use">[\s\S]*<\/footer>/,
  );
});
