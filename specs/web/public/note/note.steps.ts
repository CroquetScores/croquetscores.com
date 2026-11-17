import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";

// A note's page is drawn by the server, so what is read is there once the
// page has loaded.

const noteText = (world: WebWorld): Locator =>
  world.browserPage.locator("main .note-text");

const linkInNote = (world: WebWorld, words: string): Locator =>
  noteText(world).getByRole("link", { name: words, exact: true });

Then(
  "the note draws {string} bold",
  async function (this: WebWorld, words: string) {
    assert.deepEqual(await noteText(this).locator("strong").allInnerTexts(), [
      words,
    ]);
  },
);

Then(
  "the note's link {string} leads to {string}",
  async function (this: WebWorld, words: string, href: string) {
    assert.equal(await linkInNote(this, words).getAttribute("href"), href);
  },
);

Then(
  "the note's link {string} is marked as not vouched for",
  async function (this: WebWorld, words: string) {
    const rel = (
      (await linkInNote(this, words).getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then("the note says {string}", async function (this: WebWorld, said: string) {
  assert.equal((await noteText(this).innerText()).trim(), said);
});

// What the note's script would have done, had it run: the page's title set to
// "ran".
Then("nothing the note says has run", async function (this: WebWorld) {
  assert.notEqual(await this.browserPage.title(), "ran");
});

Then(
  "the note was written {string} ago",
  async function (this: WebWorld, ago: string) {
    const said = await this.browserPage.locator("main .note-ago").innerText();
    assert.equal(said.trim(), ago);
  },
);

Then(
  "the note was edited {string} ago",
  async function (this: WebWorld, ago: string) {
    const said = await this.browserPage
      .locator("main .note-edited-ago")
      .innerText();
    assert.equal(said.trim(), ago);
  },
);

Then("the note does not say it was edited", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator("main .note-edited").count(), 0);
});

// Paragraphs are kept as typed, parted by a blank line, as Markdown has them.
const paragraphsOf = new WeakMap<WebWorld, string[]>();

Given(
  "the manager note has a paragraph {string}",
  function (this: WebWorld, paragraph: string) {
    const paragraphs = [...(paragraphsOf.get(this) ?? []), paragraph];
    paragraphsOf.set(this, paragraphs);
    this.noteSays = paragraphs.join("\n\n");
  },
);

// What the specs are not compiled to know of the page itself.
interface LineHeightInThePage {
  getComputedStyle(element: unknown): { readonly lineHeight: string };
}

// A full line of space is one line of the text: the leading the page reads in
// multiplied by the font size, as the browser works it out.
Then(
  "the second paragraph of the note starts a full line below the first",
  async function (this: WebWorld) {
    const paragraphs = noteText(this).locator("p");
    assert.equal(await paragraphs.count(), 2);
    const first = await paragraphs.nth(0).boundingBox();
    const second = await paragraphs.nth(1).boundingBox();
    const line = await paragraphs
      .nth(0)
      .evaluate((found) =>
        parseFloat(
          (globalThis as unknown as LineHeightInThePage).getComputedStyle(found)
            .lineHeight,
        ),
      );
    assert.ok(first !== null && second !== null, "A paragraph is not shown.");
    const between = second.y - (first.y + first.height);
    assert.ok(
      Math.abs(between - line) < 1,
      `The space between is ${between}px, not a line of ${line}px.`,
    );
  },
);
