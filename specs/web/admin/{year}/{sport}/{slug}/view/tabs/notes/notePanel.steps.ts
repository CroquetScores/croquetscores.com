import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { tournamentNamed } from "../../../../../../../../application/operations/tournaments/aRequest.js";
import { managerNoteCalled } from "../../../../../../../../application/operations/tournaments/managerNoteRequests.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import {
  isMarked,
  unmarkedWithin,
} from "../../../../../../../support/marks.js";
import { eventually } from "../../../../../../../support/tournamentPage.js";
import { english } from "../../../../../../../../../src/web/languages/english.js";

// The note panel, in the Notes tab in place of its list.
const panelOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("form.note-panel");

const box = (world: SpecWorld): Locator =>
  panelOf(world).locator("#note-description");

const toolbar = (world: SpecWorld): Locator =>
  panelOf(world).getByRole("toolbar");

const tool = (world: SpecWorld, name: string): Locator =>
  toolbar(world).getByRole("button", { name, exact: true });

const descriptionTab = (world: SpecWorld, name: string): Locator =>
  panelOf(world).getByRole("tab", { name, exact: true });

const preview = (world: SpecWorld): Locator =>
  panelOf(world).locator(".note-preview");

// A feature cannot write a line break inside a step's quotes, so it writes
// "\n", which is read here as the line break it stands for.
const withLineBreaks = (written: string): string =>
  written.replaceAll("\\n", "\n");

// An accented letter, one code point that takes two bytes to send. Not the
// letter with its accent typed after it, which takes three: a browser takes
// longer than a step may over laying out hundreds of thousands of accents.
const TWO_BYTES = "ö".normalize("NFC");

const places = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
];

// What is typed --------------------------------------------------------------------

Given(
  "{string} is typed in the description",
  async function (this: SpecWorld, words: string) {
    await box(this).fill(withLineBreaks(words));
  },
);

// Where the reader is in the box, as a tool left them, rather than in place
// of what the box holds.
When(
  "{string} is typed in the description as it stands",
  async function (this: SpecWorld, words: string) {
    await this.browserPage.keyboard.type(withLineBreaks(words));
  },
);

// Hundreds of thousands of characters, which Playwright's typing takes longer
// over than a step may: put in the box at once, as pasting them would, and
// the input event that pasting raises raised, so that the panel hears of it.
const pasted = async (world: SpecWorld, words: string): Promise<void> => {
  await box(world).evaluate((element, value) => {
    const textarea = element as unknown as {
      value: string;
      dispatchEvent(event: unknown): boolean;
    };
    const page = globalThis as unknown as {
      HTMLTextAreaElement: { prototype: object };
      Event: new (type: string, init: { bubbles: boolean }) => unknown;
    };
    // React keeps its own note of what the box holds, and hears of a
    // change only through the value's own setter, not the one it puts on
    // the element.
    Reflect.set(page.HTMLTextAreaElement.prototype, "value", value, textarea);
    textarea.dispatchEvent(new page.Event("input", { bubbles: true }));
  }, words);
};

Given(
  "a description of {int} characters is typed",
  async function (this: SpecWorld, length: number) {
    await pasted(this, "n".repeat(length));
  },
);

Given(
  "a description of {int} letters of two bytes each is typed",
  async function (this: SpecWorld, length: number) {
    await pasted(this, TWO_BYTES.repeat(length));
  },
);

Given(
  "the description's words are all selected",
  async function (this: SpecWorld) {
    await box(this).selectText();
  },
);

Then(
  "the description says {string}",
  async function (this: SpecWorld, words: string) {
    assert.equal(await box(this).inputValue(), withLineBreaks(words));
  },
);

Then("the description has the focus", async function (this: SpecWorld) {
  const focused = await this.browserPage.evaluate(
    "document.activeElement?.id ?? null",
  );
  assert.equal(focused, "note-description");
});

// In English, the language a scenario reads the site in unless it says
// otherwise: the words a reader is told, which a code with none of its own
// would leave as the panel's words for anything at all.
Then(
  "the title is refused in the words for {string}",
  async function (this: SpecWorld, key: string) {
    const words = english.words[key];
    assert.ok(words !== undefined, `English has no words for ${key}.`);
    const message = panelOf(this).locator("#field-title-message");
    await message.waitFor();
    assert.equal((await message.innerText()).trim(), words);
  },
);

Then(
  "the description is refused with {string}",
  async function (this: SpecWorld, code: string) {
    const message = panelOf(this).locator("#note-description-message");
    await message.waitFor();
    const codes = ((await message.getAttribute("data-refused")) ?? "").split(
      " ",
    );
    assert.ok(codes.includes(code), `It is refused with ${codes.join(", ")}.`);
  },
);

// Write and Preview ------------------------------------------------------------------

Then(
  "the description's tab {string} is offered",
  async function (this: SpecWorld, name: string) {
    assert.equal(await descriptionTab(this, name).count(), 1);
  },
);

Then(
  "the description's first tab is {string}",
  async function (this: SpecWorld, name: string) {
    const first = panelOf(this).getByRole("tab").first();
    assert.equal((await first.innerText()).trim(), name);
  },
);

Then(
  "the description's tab {string} is the one being read",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(
        await descriptionTab(this, name).getAttribute("aria-selected"),
        "true",
      );
    });
  },
);

When(
  "the description's tab {string} is chosen",
  async function (this: SpecWorld, name: string) {
    await descriptionTab(this, name).click();
  },
);

// The toolbar ----------------------------------------------------------------------

Then(
  /^the toolbar's (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) tool is named "(.*)"$/,
  async function (this: SpecWorld, place: string, name: string) {
    const found = toolbar(this).getByRole("button").nth(places.indexOf(place));
    assert.equal(await found.getAttribute("aria-label"), name);
  },
);

Then(
  "the tool {string} shows no words",
  async function (this: SpecWorld, name: string) {
    assert.equal((await tool(this, name).innerText()).trim(), "");
  },
);

Then(
  "the tool {string} is titled {string}",
  async function (this: SpecWorld, name: string, title: string) {
    assert.equal(await tool(this, name).getAttribute("title"), title);
  },
);

Then("the toolbar is above the description", async function (this: SpecWorld) {
  const tools = await toolbar(this).boundingBox();
  const typed = await box(this).boundingBox();
  assert.ok(tools !== null && typed !== null, "One of them is not drawn.");
  assert.ok(tools.y + tools.height <= typed.y, "The toolbar is not above it.");
});

When(
  "the tool {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await tool(this, name).click();
  },
);

Then(
  "every tool's name is in the test locale",
  async function (this: SpecWorld) {
    const names: string[] = [];
    for (const each of await toolbar(this).getByRole("button").all()) {
      names.push((await each.getAttribute("aria-label")) ?? "");
    }
    assert.ok(names.length > 0, "There are no tools.");
    for (const name of names) {
      assert.ok(isMarked(name), `${name} came from elsewhere.`);
    }
  },
);

Then(
  "the toolbar is no wider than the note panel",
  async function (this: SpecWorld) {
    const tools = await toolbar(this).boundingBox();
    const panel = await panelOf(this).boundingBox();
    assert.ok(tools !== null && panel !== null, "One of them is not drawn.");
    assert.ok(
      tools.x + tools.width <= panel.x + panel.width,
      `The toolbar is ${String(tools.width)} pixels wide.`,
    );
  },
);

Then(
  "the tool {string} is at least {int} pixels tall",
  async function (this: SpecWorld, name: string, height: number) {
    const drawn = await tool(this, name).boundingBox();
    assert.ok(drawn !== null, "It is not drawn.");
    assert.ok(drawn.height >= height, `It is ${String(drawn.height)} tall.`);
  },
);

// Preview ----------------------------------------------------------------------------

Then(
  "the preview's heading is {string}",
  async function (this: SpecWorld, heading: string) {
    assert.equal(
      (await preview(this).locator("h2").innerText()).trim(),
      heading,
    );
  },
);

Then(
  "the preview draws {string} bold",
  async function (this: SpecWorld, words: string) {
    assert.deepEqual(
      await preview(this).locator(".note-text strong").allInnerTexts(),
      [words],
    );
  },
);

Then(
  "the preview says {string}",
  async function (this: SpecWorld, said: string) {
    assert.equal(
      (await preview(this).locator(".note-text").innerText()).trim(),
      said,
    );
  },
);

Then(
  "the preview's link {string} is marked as not vouched for",
  async function (this: SpecWorld, words: string) {
    const rel = (
      (await preview(this)
        .locator(".note-text")
        .getByRole("link", { name: words, exact: true })
        .getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then("the preview has no heading", async function (this: SpecWorld) {
  await preview(this).waitFor({ state: "attached" });
  assert.equal(await preview(this).locator("h2").count(), 0);
});

Then("the preview shows no description", async function (this: SpecWorld) {
  await preview(this).waitFor({ state: "attached" });
  assert.equal(await preview(this).locator(".note-text").count(), 0);
});

Then("the preview says nothing", async function (this: SpecWorld) {
  await preview(this).waitFor({ state: "attached" });
  assert.equal((await preview(this).innerText()).trim(), "");
});

// The panel ----------------------------------------------------------------------

Then(
  "the note panel is headed {string}",
  async function (this: SpecWorld, heading: string) {
    const said = panelOf(this).locator(".note-panel-heading");
    await said.waitFor();
    assert.equal((await said.innerText()).trim(), heading);
  },
);

Then(
  "the note panel's first button is {string}",
  async function (this: SpecWorld, words: string) {
    // Once the note it edits is in hand: until then it offers Cancel alone.
    await this.browserPage
      .locator('form.note-panel[aria-busy="false"]')
      .waitFor();
    const first = panelOf(this).locator(".note-panel-buttons button").first();
    assert.equal((await first.innerText()).trim(), words);
  },
);

Then(
  /^the note panel is (not )?shown$/,
  async function (this: SpecWorld, not: string | null) {
    await panelOf(this).waitFor({
      state: not === null ? "visible" : "detached",
    });
  },
);

Then(
  "every word in the note panel is in the test locale",
  async function (this: SpecWorld) {
    await panelOf(this).waitFor();
    const stray = await unmarkedWithin(this, "form.note-panel");
    assert.deepEqual(stray, [], "Words in the panel came from elsewhere.");
  },
);

Then(
  "the note panel is no wider than the window",
  async function (this: SpecWorld) {
    const panel = await panelOf(this).boundingBox();
    const window = this.browserPage.viewportSize();
    assert.ok(panel !== null && window !== null, "It is not drawn.");
    assert.ok(
      panel.x + panel.width <= window.width,
      `It ends ${String(panel.x + panel.width)} pixels across.`,
    );
  },
);

Then(
  "the note panel is refused with {string}",
  async function (this: SpecWorld, code: string) {
    const said = panelOf(this).locator(".dialog-problems [data-refused]");
    await said.waitFor();
    assert.equal(await said.getAttribute("data-refused"), code);
  },
);

// Once it has said what it refused, so that a button it never offers is not
// taken to be missing only because the panel has not yet been told.
Then(
  "the note panel does not offer {string}",
  async function (this: SpecWorld, words: string) {
    await panelOf(this).locator(".dialog-problems").waitFor();
    assert.equal(
      await panelOf(this)
        .getByRole("button", { name: words, exact: true })
        .count(),
      0,
    );
  },
);

Then(
  "the note panel does not offer the field {string}",
  async function (this: SpecWorld, label: string) {
    await panelOf(this).locator(".dialog-problems").waitFor();
    assert.equal(
      await panelOf(this).getByLabel(label, { exact: true }).count(),
      0,
    );
  },
);

// What is kept ---------------------------------------------------------------------

Then(
  "the manager note {string} of {string} says {int} letters of two bytes each",
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    length: number,
  ) {
    await eventually(this, async () => {
      const note = await managerNoteCalled(
        this,
        tournamentNamed(this, name),
        title,
      );
      assert.equal(note.description?.toString(), TWO_BYTES.repeat(length));
    });
  },
);
