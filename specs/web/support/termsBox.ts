// The box on the forms that ask a reader to agree to the terms for those who
// write: ticked as a reader ticks it, and asked of what it is labelled and where
// its link leads.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "./world.js";

const box = 'section.dialog input[type="checkbox"][name="termsOfUse"]';

When("the terms of use are agreed to", async function (this: WebWorld) {
  await this.browserPage.check(box);
});

// Asked of the box by what it is labelled and where its link leads, so that a
// box with no words beside it, or words leading nowhere, does not count.
Then(
  "the dialog asks the reader to agree to the terms of use for those who write",
  async function (this: WebWorld) {
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
    assert.equal(found.label, "I agree to the terms of use");
    assert.equal(found.href, "/admin/terms-of-use");
  },
);

// Beneath the box, found by what the box announces, as a field's message is.
Then(
  "the terms of use box says {string}",
  async function (this: WebWorld, words: string) {
    const said = await this.browserPage.evaluate<string | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(box)});
      const id = box?.getAttribute("aria-describedby");
      const message = id ? document.getElementById(id) : null;
      return message ? message.textContent.trim() : null;
    })()`);
    assert.equal(said, words);
  },
);
