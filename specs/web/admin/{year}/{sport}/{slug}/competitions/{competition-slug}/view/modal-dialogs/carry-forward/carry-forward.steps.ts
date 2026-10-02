import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../../../support/marks.js";
import {
  eventually,
  settled,
  tabPanel,
} from "../../../../../../../../../support/tournamentPage.js";

// The carry forward dialog (carry-forward.feature), open over a competition's
// Players tab. What finds a field, types in it, presses a button and reads a
// modal dialog is shared with the admin's other dialogs; these are what this
// one adds.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

// Whatever the button is called in the reader's language.
When(
  "the way to change the carry forward of the player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await settled(this);
    await tabPanel(this)
      .locator("ul[data-listed] > .listed-item")
      .filter({
        has: this.browserPage.locator(".listed-name", {
          hasText: new RegExp(`^${name}$`),
        }),
      })
      .locator('button[data-action="carryForward"]')
      .click();
  },
);

// Found by where it is rather than by its label, which is in whatever language
// the page is in.
When(
  "{string} is typed into the first count",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).locator("#field-matchWins").fill(words);
  },
);

Then(
  "the carry forward dialog names the player {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    const title = (
      await dialogOf(this).locator(".dialog-title").innerText()
    ).trim();
    assert.ok(title.includes(name), `It is titled ${title}.`);
  },
);

// By the code it carries rather than the words, which are the reader's
// language's to choose.
Then(
  "the carry forward dialog says above its fields that it was refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await dialogOf(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `It says it was refused with ${refused || "nothing"}.`,
      );
    });
  },
);

// The player's name is filled into the title's words, and read inside its
// marks with them.
Then(
  "every word in the carry forward dialog but the player's name is in the test locale",
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);
