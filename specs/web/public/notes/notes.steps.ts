import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { english } from "../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  inHandOf,
  load,
  scenarioOf,
} from "../../../application/operations/tournaments/aRequest.js";

// The Notes page is drawn by the server, with no scripting, so what is read
// is there once the page has loaded.

const notes = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .note-listed");

// A title is the user's own words, so any character in it that a pattern
// would read as more than itself is escaped.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const noteListed = (world: SpecWorld, title: string): Locator =>
  notes(world).filter({
    has: world.browserPage.locator(".note-listed-title", {
      hasText: exactly(title),
    }),
  });

const titleOf = async (note: Locator): Promise<string> =>
  (await note.locator(".note-listed-title").innerText()).trim();

// What reads a mark for what it is reads the page's own idea of red: an
// element coloured with the palette's --danger, put on the page and asked its
// colour, so that the step does not have to know the palette.
const dangerOn = (world: SpecWorld): Promise<string> =>
  world.browserPage.evaluate(`(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--danger)";
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  })()`);

const colourOf = (mark: Locator): Promise<string> =>
  mark.evaluate(
    (element: unknown) =>
      (
        globalThis as unknown as {
          getComputedStyle(element: unknown): { color: string };
        }
      ).getComputedStyle(element).color,
  );

const wordsFor = (key: string): string => {
  const said = english.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

When(
  "the page at {string} is opened with scripting off",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

// Read by opening its page, which is what reading it is, in this browser.
// Found by its title among the scenario's tournaments, since a note's page is
// found by its id, which the scenario never knew.
Given(
  "the reader has read the note {string}",
  async function (this: SpecWorld, title: string) {
    for (const id of scenarioOf(this).byName.values()) {
      const note = (await inHandOf(this).managerNotesOf(id)).find(
        (each) => each.title === title,
      );
      if (note === undefined) continue;
      const tournament = await load(this, id);
      await this.browserPage.goto(
        `${this.baseUrl!}/${tournament.address.toString()}/notes/${note.id.slice(note.id.indexOf("/") + 1)}`,
      );
      return;
    }
    assert.fail(`No tournament has the note ${title}.`);
  },
);

// What another browser is to these scenarios is a browser with none of this
// one's cookies, so this one's are cleared rather than a second one opened.
Given("the reader opens another browser", async function (this: SpecWorld) {
  await this.browserPage.context().clearCookies();
});

Then(
  "{string} is among the notes",
  async function (this: SpecWorld, title: string) {
    assert.equal(await noteListed(this, title).count(), 1);
  },
);

Then(
  /^the (first|second) note is "(.*)"$/,
  async function (this: SpecWorld, which: string, title: string) {
    const note = notes(this).nth(which === "first" ? 0 : 1);
    assert.equal(await titleOf(note), title);
  },
);

Then(
  "the note {string} was written {string} ago",
  async function (this: SpecWorld, title: string, ago: string) {
    const said = await noteListed(this, title)
      .locator(".note-listed-ago")
      .innerText();
    assert.equal(said.trim(), ago);
  },
);

Then(
  /^the note "(.*)" is (not )?marked as new$/,
  async function (this: SpecWorld, title: string, not: string | null) {
    const marks = await noteListed(this, title).locator(".new-mark").count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the note {string} is marked in red",
  async function (this: SpecWorld, title: string) {
    const mark = noteListed(this, title).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the note {string} is said as the words for {string}",
  async function (this: SpecWorld, title: string, key: string) {
    const said = await noteListed(this, title)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, wordsFor(key));
  },
);

// The section bar's -------------------------------------------------------------

const sectionItem = (world: SpecWorld, label: string): Locator =>
  world.browserPage.locator(".site-sections li").filter({
    has: world.browserPage.locator(`a:text-is("${label}")`),
  });

Then(
  /^the section "(.*)" is (not )?marked as new$/,
  async function (this: SpecWorld, label: string, not: string | null) {
    const marks = await sectionItem(this, label).locator(".new-mark").count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the section {string} is marked in red",
  async function (this: SpecWorld, label: string) {
    const mark = sectionItem(this, label).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the section {string} is said as the words for {string}",
  async function (this: SpecWorld, label: string, key: string) {
    const said = await sectionItem(this, label)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, wordsFor(key));
  },
);
