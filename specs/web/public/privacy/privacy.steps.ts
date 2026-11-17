import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { look, lookedAt } from "../../support/looking.js";
import type { WebWorld } from "../../support/world.js";

When("the privacy statement is opened", async function (this: WebWorld) {
  await look(this, "/privacy");
});

Then("the page is the privacy statement", function (this: WebWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="privacy"/,
  );
});

Then("the statement is in Welsh", function (this: WebWorld) {
  assert.match(lookedAt(this), /<article class="help" lang="cy"/);
});

Then("the footer links to the privacy statement", function (this: WebWorld) {
  assert.match(
    lookedAt(this),
    /<footer[\s\S]*<a href="\/privacy">[\s\S]*<\/footer>/,
  );
});

// As the page writes it, which is escaped: the address is text in a page and
// a value in an attribute, and what is asked is that neither is broken by
// what is in it.
Then(
  "the statement links to send email to {string}",
  function (this: WebWorld, emailAddress: string) {
    const written = emailAddress.replaceAll("&", "&amp;");
    assert.ok(
      lookedAt(this).includes(`<a href="mailto:${written}">${written}</a>`),
      "The address is not linked as written.",
    );
  },
);
