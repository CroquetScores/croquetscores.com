import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// What the printer is shown is the page under the browser's print rules, which
// a browser can be asked to apply to the page on the screen, so that what is
// checked is what the stylesheet says rather than a print preview nobody can
// read back. The paper's shape is the page's named page, which the browser
// reports as the `page` of the body it is set on.
const printButton = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .print-button");

const results = (world: SpecWorld): Locator =>
  world.browserPage.locator(
    "main :is(.block-grid, .knockout, .swiss, .test-matches)",
  );

interface InThePage {
  getComputedStyle(element: unknown): { readonly page: string };
  readonly document: { readonly body: unknown };
}

When("the page is laid out for the printer", async function (this: SpecWorld) {
  await this.browserPage.emulateMedia({ media: "print" });
});

Then("the print button is offered", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), true);
});

Then("the print button is in the page", async function (this: SpecWorld) {
  assert.equal(await printButton(this).count(), 1);
});

Then("the print button is not offered", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), false);
});

Then("the print button is not printed", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), false);
});

Then(
  "the printed tournament name is {string}",
  async function (this: SpecWorld, name: string) {
    const printed = this.browserPage.locator("main .print-tournament");
    assert.equal(await printed.isVisible(), true);
    assert.equal((await printed.innerText()).trim(), name);
  },
);

Then(
  "the printed tournament name is not shown",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .print-tournament").isVisible(),
      false,
    );
  },
);

Then(
  "the printed competition name is {string}",
  async function (this: SpecWorld, name: string) {
    const heading = this.browserPage.locator("main h1");
    assert.equal(await heading.isVisible(), true);
    assert.equal((await heading.innerText()).trim(), name);
  },
);

Then(
  "the printed tournament name is above the printed competition name",
  async function (this: SpecWorld) {
    const tournament = await this.browserPage
      .locator("main .print-tournament")
      .boundingBox();
    const competition = await this.browserPage.locator("main h1").boundingBox();
    assert.ok(tournament !== null && competition !== null);
    assert.ok(tournament.y + tournament.height <= competition.y);
  },
);

Then("the results are printed", async function (this: SpecWorld) {
  assert.equal(await results(this).first().isVisible(), true);
});

Then("the site's bar is not printed", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator(".site-bar").isVisible(), false);
});

Then("the section bar is not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(".site-sections").isVisible(),
    false,
  );
});

Then("the footer is not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(".site-footer").isVisible(),
    false,
  );
});

Then("the views are not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator("main .competition-views").isVisible(),
    false,
  );
});

Then(
  /^the paper is (landscape|portrait)$/,
  async function (this: SpecWorld, shape: string) {
    const named = await this.browserPage.evaluate(() => {
      const inThePage = globalThis as unknown as InThePage;
      return inThePage.getComputedStyle(inThePage.document.body).page;
    });
    assert.equal(named, shape);
  },
);
