import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";
import { colourOf, dangerOn } from "../../support/newMarks.js";

// The Notes page is drawn by the server, with no scripting, so what is read
// is there once the page has loaded.

const notes = (world: WebWorld): Locator =>
  world.browserPage.locator("main .note-listed");

// A title is the user's own words, so any character in it that a pattern
// would read as more than itself is escaped.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const noteListed = (world: WebWorld, title: string): Locator =>
  notes(world).filter({
    has: world.browserPage.locator(".note-listed-title", {
      hasText: exactly(title),
    }),
  });

const titleOf = async (note: Locator): Promise<string> =>
  (await note.locator(".note-listed-title").innerText()).trim();

// Read by opening its page, which is what reading it is, in this browser. Found
// by its title on the notes page of the tournament that has it.
Given(
  "the reader has read the note {string}",
  async function (this: WebWorld, title: string) {
    for (const { address } of this.tournaments.values()) {
      await this.browserPage.goto(`${this.baseUrl!}/${address}/notes`);
      const link = this.browserPage.getByRole("link", {
        name: title,
        exact: true,
      });
      if ((await link.count()) === 0) continue;
      await Promise.all([this.browserPage.waitForNavigation(), link.click()]);
      return;
    }
    assert.fail(`No tournament has the note ${title}.`);
  },
);

// What another browser is to these scenarios is a browser with none of this
// one's cookies, so this one's are cleared rather than a second one opened.
Given("the reader opens another browser", async function (this: WebWorld) {
  await this.browserPage.context().clearCookies();
});

Then(
  "{string} is among the notes",
  async function (this: WebWorld, title: string) {
    assert.equal(await noteListed(this, title).count(), 1);
  },
);

Then(
  /^the (first|second) note is "(.*)"$/,
  async function (this: WebWorld, which: string, title: string) {
    const note = notes(this).nth(which === "first" ? 0 : 1);
    assert.equal(await titleOf(note), title);
  },
);

Then(
  "the note {string} was written {string} ago",
  async function (this: WebWorld, title: string, ago: string) {
    const said = await noteListed(this, title)
      .locator(".note-listed-ago")
      .innerText();
    assert.equal(said.trim(), ago);
  },
);

Then(
  /^the note "(.*)" is (not )?marked as new$/,
  async function (this: WebWorld, title: string, not: string | null) {
    const marks = await noteListed(this, title).locator(".new-mark").count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the note {string} is marked in red",
  async function (this: WebWorld, title: string) {
    const mark = noteListed(this, title).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the note {string} is said as {string}",
  async function (this: WebWorld, title: string, words: string) {
    const said = await noteListed(this, title)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, words);
  },
);

// The section bar's -------------------------------------------------------------

const sectionItem = (world: WebWorld, label: string): Locator =>
  world.browserPage.locator(".site-sections li").filter({
    has: world.browserPage.locator(`a:text-is("${label}")`),
  });

Then(
  /^the section "(.*)" is (not )?marked as new$/,
  async function (this: WebWorld, label: string, not: string | null) {
    const marks = await sectionItem(this, label).locator(".new-mark").count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the section {string} is marked in red",
  async function (this: WebWorld, label: string) {
    const mark = sectionItem(this, label).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the section {string} is said as {string}",
  async function (this: WebWorld, label: string, words: string) {
    const said = await sectionItem(this, label)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, words);
  },
);
