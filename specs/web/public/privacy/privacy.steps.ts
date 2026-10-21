import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { join } from "node:path";

import {
  helpLibraryIn,
  helpLibraryWithout,
} from "../../../../src/web/common/helpLibrary.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  anApplicationAdministeredBy,
  anApplicationWithHelp,
} from "../../support/browser.js";
import { look, lookOn, lookedAt } from "../../support/lookedAt.js";

const dist = join(import.meta.dirname, "..", "..", "..", "..", "dist", "help");

Given(
  "the help has no Welsh privacy statement",
  async function (this: SpecWorld) {
    const without = helpLibraryWithout(helpLibraryIn(dist), "cy", "privacy");
    lookOn(this, await anApplicationWithHelp(this, without));
  },
);

Given(
  "the site is told its administrator is {string}",
  async function (this: SpecWorld, emailAddress: string) {
    lookOn(this, await anApplicationAdministeredBy(this, emailAddress));
  },
);

When("the privacy statement is opened", async function (this: SpecWorld) {
  await look(this, "/privacy");
});

When(
  "the help page {string} is looked at",
  async function (this: SpecWorld, name: string) {
    await look(this, `/help/${name}`);
  },
);

When(
  "the page at {string} is looked at",
  async function (this: SpecWorld, address: string) {
    await look(this, address);
  },
);

Then("the page is the privacy statement", function (this: SpecWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="privacy"/,
  );
});

Then("the statement is in English", function (this: SpecWorld) {
  assert.match(lookedAt(this), /<article class="help" lang="en"/);
});

Then("the statement is in Welsh", function (this: SpecWorld) {
  assert.match(lookedAt(this), /<article class="help" lang="cy"/);
});

Then(
  "the statement links to send email to the administrator",
  function (this: SpecWorld) {
    // Whoever the scenarios' site was told administers it, whichever address
    // that is: what is specified is that it is said, not which it is.
    assert.match(
      lookedAt(this),
      /<\/article>\s*<p>[^<]*: <a href="mailto:(\S+@\S+)">\1<\/a><\/p>/,
    );
  },
);

Then("the footer links to the privacy statement", function (this: SpecWorld) {
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
  function (this: SpecWorld, emailAddress: string) {
    const written = emailAddress.replaceAll("&", "&amp;");
    assert.ok(
      lookedAt(this).includes(`<a href="mailto:${written}">${written}</a>`),
      "The address is not linked as written.",
    );
  },
);
