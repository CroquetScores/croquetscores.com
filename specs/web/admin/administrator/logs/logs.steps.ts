// The page where an administrator reads the server's log (logs.feature), in a
// real browser. The entries are filled in once the API has answered, so every
// step waits for what it looks at.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { keep } from "../../../../infrastructure/support/serverLog.js";
import { clockFor } from "../../../support/clock.js";

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

const AGO: Readonly<Record<string, number>> = {
  "a minute ago": 60,
  "an hour and a minute ago": 61 * 60,
  "two hours ago": 2 * 60 * 60,
};

// An entry is written against the clock the site reads, which a scenario
// holds still, and not against the machine's, which the site never asks.
Given(
  /^the log has an entry "([^"]*)"(?: at the severity (\w+))?(?: written at "([^"]*)")?(?: with the reference "([^"]*)")?(?: written (a minute ago|an hour and a minute ago|two hours ago))?$/,
  async function (
    this: SpecWorld,
    message: string,
    severity: string | null,
    writtenAt: string | null,
    reference: string | null,
    ago: string | null,
  ) {
    const now = clockFor(this).now.getTime();
    const when =
      writtenAt !== null
        ? new Date(writtenAt)
        : new Date(now - (ago === null ? 0 : (AGO[ago] ?? 0)) * 1000);
    await keep(this, when, message, severity, reference);
  },
);

const entries = (world: SpecWorld): Locator =>
  world.browserPage.locator("main ul.log-entries > li > details.log-entry");

const first = (world: SpecWorld): Locator => entries(world).first();

Then(
  "the first entry says {string}",
  async function (this: SpecWorld, said: string) {
    await eventually(async () => {
      assert.equal(
        await first(this).locator(".log-entry-message").innerText({
          timeout: 100,
        }),
        said,
      );
    });
  },
);

Then(
  "the first entry's severity is {string}",
  async function (this: SpecWorld, severity: string) {
    await eventually(async () => {
      assert.equal(
        await first(this).locator(".log-entry-severity").innerText({
          timeout: 100,
        }),
        severity,
      );
    });
  },
);

Then(
  "the first entry was written at {string}",
  async function (this: SpecWorld, moment: string) {
    await eventually(async () => {
      assert.equal(
        await first(this)
          .locator("time.log-entry-written")
          .getAttribute("datetime", { timeout: 100 }),
        new Date(moment).toISOString(),
      );
    });
  },
);

// Compared by where they are drawn rather than by their order in the page's
// source, which is what a reader's eye follows only as far as the layout lets
// it.
Then(
  "the first entry's severity comes before when it was written",
  async function (this: SpecWorld) {
    await eventually(async () => {
      const severity = await first(this)
        .locator(".log-entry-severity")
        .boundingBox({ timeout: 100 });
      const written = await first(this)
        .locator("time.log-entry-written")
        .boundingBox({ timeout: 100 });
      assert.ok(severity !== null && written !== null, "Not drawn.");
      assert.ok(severity.x < written.x, "The severity is not first.");
    });
  },
);

When("the first entry is pressed", async function (this: SpecWorld) {
  await first(this).locator("summary").click();
});

Then(
  "the first entry's details include {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      const details = first(this).locator(".log-entry-details");
      assert.ok(await details.isVisible(), "The details are hidden.");
      assert.ok((await details.innerText({ timeout: 100 })).includes(words));
    });
  },
);

// Looked for once the entry is drawn, so that a page not yet drawn is not
// taken for one whose entries are hidden.
Then("the first entry's details are hidden", async function (this: SpecWorld) {
  await eventually(async () => {
    assert.equal(await entries(this).count(), 1);
  });
  assert.equal(
    await first(this).locator(".log-entry-details").isVisible(),
    false,
  );
});

Then(
  "the page says there are no log entries",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage.locator("main [data-none]").count(),
        1,
      );
    });
  },
);

// Looked for once an entry is drawn, which is when the page has answered, so
// that a page not yet drawn is not taken for one that does not say it.
Then(
  "the page does not say there are no log entries",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(await entries(this).count(), 1);
    });
    assert.equal(await this.browserPage.locator("main [data-none]").count(), 0);
  },
);

// Narrowing ----------------------------------------------------------------

const severity = (world: SpecWorld): Locator =>
  world.browserPage.locator("main form.log-narrowing select[name=severity]");

const text = (world: SpecWorld): Locator =>
  world.browserPage.locator("main form.log-narrowing input[name=text]");

Then(
  "the severity is {string}",
  async function (this: SpecWorld, chosen: string) {
    await eventually(async () => {
      assert.equal(await severity(this).inputValue({ timeout: 100 }), chosen);
    });
  },
);

When(
  "the severity {string} is chosen",
  async function (this: SpecWorld, chosen: string) {
    await severity(this).selectOption(chosen);
  },
);

When(
  "{string} is entered to look up",
  async function (this: SpecWorld, entered: string) {
    await text(this).fill(entered);
  },
);

// The form is sent to the server, so the page that answers is a new one; the
// steps after it wait for what they look at, which the old page cannot give.
When("the Show button is pressed", async function (this: SpecWorld) {
  await this.browserPage
    .locator("main form.log-narrowing button[type=submit]")
    .click();
  await this.browserPage.waitForLoadState("load");
});

Then(
  "the address's search is {string}",
  async function (this: SpecWorld, search: string) {
    await this.browserPage.waitForURL((url) => url.search === search);
  },
);

Then(
  "the text to look up is {string}",
  async function (this: SpecWorld, entered: string) {
    await eventually(async () => {
      assert.equal(await text(this).inputValue({ timeout: 100 }), entered);
    });
  },
);

// Pruning --------------------------------------------------------------------

const dialog = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog.modal-dialog[open]");

When("the Prune button is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator("main button.log-prune").click();
});

Then(
  "the page asks whether to remove the log from before the last hour",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.ok(await dialog(this).isVisible(), "Nothing is asked.");
    });
  },
);

When("the pruning is declined", async function (this: SpecWorld) {
  await dialog(this).locator("button:not(.button-submit)").click();
});

When("the pruning is agreed to", async function (this: SpecWorld) {
  await dialog(this).locator("button.button-submit").click();
});

Then(
  /^the page says (\d+) entries were removed$/,
  async function (this: SpecWorld, count: string) {
    await eventually(async () => {
      assert.equal(
        Number(
          await this.browserPage
            .locator("main [data-removed]")
            .getAttribute("data-removed", { timeout: 100 }),
        ),
        Number(count),
      );
    });
  },
);
