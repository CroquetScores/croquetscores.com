// The page where an administrator sees and sets database access
// (databaseStatus.feature), in a real browser, and the answers it asks of the
// site. That access is on or off, and what readers are told, are said in
// FileDatabaseAccess.steps.ts, which does it of the site the scenario is
// about where it has no file of its own.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { addressingOf } from "../../../support/browser.js";
import { englishForScenarios } from "../../../support/languages.js";

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const buttonCalled = (world: SpecWorld, words: string): Locator =>
  world.browserPage
    .locator("main button")
    .filter({ hasText: new RegExp(`^${words}$`) });

const status = (world: SpecWorld): Locator =>
  world.browserPage.locator("main [data-access]");

Then(
  /^the page says database access is (on|off)$/,
  async function (this: SpecWorld, which: string) {
    await eventually(async () => {
      assert.equal(await status(this).getAttribute("data-access"), which);
    });
  },
);

Then(
  "the page says {int} minutes are expected",
  async function (this: SpecWorld, minutes: number) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("main [data-expected]")
          .getAttribute("data-expected"),
        String(minutes),
      );
    });
  },
);

Then(
  "the page says readers are told {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      const told = this.browserPage.locator('main [data-told="words"]');
      assert.ok((await told.innerText()).includes(words));
    });
  },
);

Then(
  "the page says readers are told the usual sentence",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("main [data-told]")
          .getAttribute("data-told"),
        "usual",
      );
    });
  },
);

// What a reader who is let through to nothing else is shown.
Then("the maintenance page is shown", async function (this: SpecWorld) {
  const usual = englishForScenarios.words["errors.maintenance"];
  assert.ok(usual !== undefined, "English has no usual sentence.");
  await eventually(async () => {
    assert.ok(
      (await this.browserPage.locator("body").innerText()).includes(usual),
    );
  });
});

// The form -------------------------------------------------------------------

Given(
  "{string} is typed in the minutes field",
  async function (this: SpecWorld, minutes: string) {
    await this.browserPage.locator("#field-minutes").fill(minutes);
  },
);

Given(
  "{string} is typed in the words field",
  async function (this: SpecWorld, words: string) {
    await this.browserPage.locator("#field-words").fill(words);
  },
);

When(
  /^(Turn off|Change|Turn on) is pressed$/,
  async function (this: SpecWorld, button: string) {
    await buttonCalled(this, button).click();
  },
);

Then(
  /^(Turn on|Change) is not offered$/,
  async function (this: SpecWorld, button: string) {
    // Once the page has drawn the form, which Turn off is always in.
    await buttonCalled(this, "Turn off").waitFor();
    assert.equal(await buttonCalled(this, button).count(), 0);
  },
);

Then(
  "the minutes field says the minutes are needed",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("#field-minutes-message")
          .getAttribute("data-refused"),
        "DatabaseAccess.MinutesNeeded",
      );
    });
  },
);

Then(
  "the minutes field says {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("#field-minutes-message")
          .getAttribute("data-refused"),
        code,
      );
    });
  },
);

// The answers the page asks of the site ----------------------------------------

// As the signed-in reader's browser would ask, with its cookies.
const answers = new WeakMap<SpecWorld, number>();

When(
  "the database access status is asked for",
  async function (this: SpecWorld) {
    const response = await this.browserPage.request.get(
      `${this.baseUrl!}/api/v1/database-access`,
      { headers: addressingOf(this) },
    );
    answers.set(this, response.status());
  },
);

When(
  "database access is asked to be turned off for {int} minutes",
  async function (this: SpecWorld, minutes: number) {
    const response = await this.browserPage.request.post(
      `${this.baseUrl!}/api/v1/database-access/off`,
      { headers: addressingOf(this), data: { minutes, words: "" } },
    );
    answers.set(this, response.status());
  },
);

Then("the answer is refused", function (this: SpecWorld) {
  const status = answers.get(this);
  assert.ok(
    status === 401 || status === 422,
    `The answer was ${String(status)}, not a refusal.`,
  );
});
