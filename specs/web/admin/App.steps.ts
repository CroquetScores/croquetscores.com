import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { menuLink } from "../support/menuLink.js";

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
    await this.browserPage.click(menuLink(label));
  },
);

// Whether the last press for a new tab was stopped, by the scenario it was in.
const pressesStopped = new WeakMap<SpecWorld, boolean>();

// Pressed as a reader asks for a new tab: with Control, or Command on a Mac.
// What the admin does with the press is told by whether anything it listens
// with stopped the browser following the link, read once every listener has
// had it, since the window hears a click last. Whether the browser then opens
// a tab is not waited on: a headless browser does not do it every time.
When(
  "the section {string} is pressed to open it in a new tab",
  async function (this: SpecWorld, label: string) {
    const page = this.browserPage;
    await page.evaluate(`(() => {
      window.addEventListener("click", (event) => {
        window.pressStopped = event.defaultPrevented;
      }, { once: true });
    })()`);
    await page.click(`nav.site-sections a:text-is("${label}")`, {
      modifiers: ["ControlOrMeta"],
    });
    const stopped = await page.evaluate<boolean | undefined>(
      "window.pressStopped",
    );
    assert.ok(stopped !== undefined, "The press was not heard.");
    pressesStopped.set(this, stopped);
  },
);

Then("the press is left to the browser", function (this: SpecWorld) {
  const stopped = pressesStopped.get(this);
  assert.ok(stopped !== undefined, "Nothing was pressed for a new tab.");
  assert.equal(stopped, false, "The admin stopped the browser following it.");
});
