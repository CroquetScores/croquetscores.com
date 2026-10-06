import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";

// A note's page is drawn by the server, so what is read is there once the
// page has loaded.

const noteText = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .note-text");

const linkInNote = (world: SpecWorld, words: string): Locator =>
  noteText(world).getByRole("link", { name: words, exact: true });

When(
  "the page at {string} is opened with scripting on",
  async function (this: SpecWorld, path: string) {
    await withScripting(this);
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

Then(
  "the second-level heading is {string}",
  async function (this: SpecWorld, heading: string) {
    const said = await this.browserPage.locator("main h2").first().innerText();
    assert.equal(said.trim(), heading);
  },
);

Then(
  "the note draws {string} bold",
  async function (this: SpecWorld, words: string) {
    assert.deepEqual(await noteText(this).locator("strong").allInnerTexts(), [
      words,
    ]);
  },
);

Then(
  "the note's link {string} leads to {string}",
  async function (this: SpecWorld, words: string, href: string) {
    assert.equal(await linkInNote(this, words).getAttribute("href"), href);
  },
);

Then(
  "the note's link {string} is marked as not vouched for",
  async function (this: SpecWorld, words: string) {
    const rel = (
      (await linkInNote(this, words).getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then("the note says {string}", async function (this: SpecWorld, said: string) {
  assert.equal((await noteText(this).innerText()).trim(), said);
});

// What the note's script would have done, had it run: the page's title set to
// "ran".
Then("nothing the note says has run", async function (this: SpecWorld) {
  assert.notEqual(await this.browserPage.title(), "ran");
});

Then(
  "the note was written {string} ago",
  async function (this: SpecWorld, ago: string) {
    const said = await this.browserPage.locator("main .note-ago").innerText();
    assert.equal(said.trim(), ago);
  },
);

Then(
  "the note was edited {string} ago",
  async function (this: SpecWorld, ago: string) {
    const said = await this.browserPage
      .locator("main .note-edited-ago")
      .innerText();
    assert.equal(said.trim(), ago);
  },
);

Then("the note does not say it was edited", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator("main .note-edited").count(), 0);
});
