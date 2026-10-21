import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { englishForScenarios } from "../../support/languages.js";
import { look, lookedAt } from "../../support/lookedAt.js";

// The pages -------------------------------------------------------------------

When("the terms of use are opened", async function (this: SpecWorld) {
  await look(this, "/terms-of-use");
});

When(
  "the terms of use for those who write are opened",
  async function (this: SpecWorld) {
    await look(this, "/admin/terms-of-use");
  },
);

Then("the page is the terms of use", function (this: SpecWorld) {
  assert.match(
    lookedAt(this),
    /<article class="help"[^>]* data-page="terms-of-use"/,
  );
});

Then(
  "the page is the terms of use for those who write",
  function (this: SpecWorld) {
    assert.match(
      lookedAt(this),
      /<article class="help"[^>]* data-page="admin\/terms-of-use"/,
    );
  },
);

Then("the terms are in English", function (this: SpecWorld) {
  assert.match(lookedAt(this), /<article class="help" lang="en"/);
});

Then(
  "the terms link to the terms of use for those who write",
  function (this: SpecWorld) {
    assert.match(
      lookedAt(this),
      /<article[\s\S]*<a href="\/admin\/terms-of-use">[\s\S]*<\/article>/,
    );
  },
);

Then(
  "the terms have the heading {string}",
  function (this: SpecWorld, heading: string) {
    const headings = [
      ...lookedAt(this).matchAll(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/g),
    ].map((found) => found[1]);
    assert.ok(
      headings.includes(heading),
      `The terms have the headings ${JSON.stringify(headings)}.`,
    );
  },
);

Then("the footer links to the terms of use", function (this: SpecWorld) {
  assert.match(
    lookedAt(this),
    /<footer[\s\S]*<a href="\/terms-of-use">[\s\S]*<\/footer>/,
  );
});

// The box on the forms that ask for them -------------------------------------

const box = 'section.dialog input[type="checkbox"][name="termsOfUse"]';

// The box, ticked as a reader ticks it, by pressing it.
When("the terms of use are agreed to", async function (this: SpecWorld) {
  await this.browserPage.check(box);
});

// Asked of the box by what it is labelled and where its link leads, so that a
// box with no words beside it, or words leading nowhere, does not count.
Then(
  "the dialog asks the reader to agree to the terms of use for those who write",
  async function (this: SpecWorld) {
    const found = await this.browserPage.evaluate<{
      label: string;
      href: string | null;
    } | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(box)});
      const label = box?.labels?.[0];
      if (!label) return null;
      return {
        label: label.textContent.trim(),
        href: label.querySelector("a")?.getAttribute("href") ?? null,
      };
    })()`);
    assert.ok(found !== null, "The dialog has no box to agree with.");
    assert.equal(found.label, englishForScenarios.words["termsOfUse.agree"]);
    assert.equal(found.href, "/admin/terms-of-use");
  },
);

// Beneath the box, found by what the box announces, as a field's message is.
Then(
  "the terms of use box says the message for {string}",
  async function (this: SpecWorld, code: string) {
    const said = await this.browserPage.evaluate<string | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(box)});
      const id = box?.getAttribute("aria-describedby");
      const message = id ? document.getElementById(id) : null;
      return message ? message.textContent.trim() : null;
    })()`);
    assert.equal(said, englishForScenarios.words[code]);
  },
);
