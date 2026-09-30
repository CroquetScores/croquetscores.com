import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";

// Whether the admin moved in place or had the browser load the page again,
// told by a value left on the window: it survives anything the admin does,
// and nothing survives a page being loaded afresh.

interface Marked {
  leftByTheScenario?: boolean;
}

const left = async (world: SpecWorld): Promise<boolean> =>
  world.browserPage.evaluate(
    () => (globalThis as Marked).leftByTheScenario === true,
  );

Given("something is left on the page", async function (this: SpecWorld) {
  await this.browserPage.evaluate(() => {
    (globalThis as Marked).leftByTheScenario = true;
  });
});

Then(
  "what was left on the page is still there",
  async function (this: SpecWorld) {
    assert.equal(await left(this), true, "The page was loaded again.");
  },
);

// Once the page that was headed for has loaded, so that the question is asked
// of it rather than of one on its way out.
Then("what was left on the page is gone", async function (this: SpecWorld) {
  await this.browserPage.waitForLoadState();
  assert.equal(await left(this), false, "The page was not loaded again.");
});

// A page drawn in place is drawn a moment after the press, and until then the
// page it left is still showing its own heading, so the heading is waited on
// to become the one wanted rather than read once.
Then(
  "the page comes to be headed {string}",
  async function (this: SpecWorld, name: string) {
    const heading = this.browserPage.locator("main h1").first();
    const until = Date.now() + 5000;
    for (;;) {
      const said = (await heading.innerText().catch(() => "")).trim();
      if (said === name) return;
      assert.ok(Date.now() < until, `The page is headed "${said}".`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  },
);

// In the header's navigation, which at this width is laid out rather than
// behind the menu button.
When(
  "the link {string} in the header is pressed",
  async function (this: SpecWorld, label: string) {
    await this.browserPage.click(`header .menu-links a:text-is("${label}")`);
  },
);

// Pressed as a reader asks for a new tab: with Control, or Command on a Mac.
// Given longer than a step's usual five seconds, since the browser starts a
// page of its own for the tab. With every scenario's browser running at once
// in the whole suite, that start alone ran past five seconds, and the
// scenario failed while the tab it was waiting for was on its way.
When(
  "the section {string} is pressed to open it in a new tab",
  { timeout: 20_000 },
  async function (this: SpecWorld, label: string) {
    const opened = this.browserContext!.waitForEvent("page");
    await this.browserPage.click(`nav.site-sections a:text-is("${label}")`, {
      modifiers: ["ControlOrMeta"],
    });
    await opened;
  },
);

Then(
  "the new tab's address is {string}",
  async function (this: SpecWorld, path: string) {
    const tab = this.browserContext!.pages().find(
      (page) => page !== this.browserPage,
    );
    assert.ok(tab !== undefined, "No new tab was opened.");
    // Once the tab is at the address, and not once it has loaded, which a tab
    // opened behind the one being read can be slow to do.
    await tab
      .waitForURL((url) => url.pathname === path, {
        timeout: 3000,
        waitUntil: "commit",
      })
      .catch(() => {
        assert.fail(`The new tab is at ${tab.url()}.`);
      });
  },
);
