import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { convertHelpPage } from "../../../../src/web/common/helpPages.js";
import type { SpecWorld } from "../../../support/world.js";

const english = resolve(import.meta.dirname, "../../../../docs/help/english");

// The page as the site converts it, kept as HTML, since the sections of a page
// are found by the bookmarks its headings carry.
const converted = new WeakMap<SpecWorld, string>();

When(
  "the English page {string} is converted",
  async function (this: SpecWorld, name: string) {
    const at = `${name}.md`;
    const source = await readFile(join(english, at), "utf8");
    converted.set(this, convertHelpPage(source, at).html);
  },
);

const html = (world: SpecWorld): string => {
  const found = converted.get(world);
  assert.ok(found !== undefined, "No page was converted.");
  return found;
};

// The words of some markup, as a reader reads them.
const wordsIn = (markup: string): string =>
  markup
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

// What lies under the heading with the bookmark `bookmark`, up to the next
// heading of its level.
const sectionOf = (world: SpecWorld, bookmark: string): string => {
  const page = html(world);
  const opening = new RegExp(`<h2 id="${bookmark}">`).exec(page);
  assert.ok(opening !== null, `The page has no section ${bookmark}.`);
  const from = opening.index + opening[0].length;
  const next = page.indexOf("<h2", from);
  return wordsIn(page.slice(from, next === -1 ? undefined : next));
};

Then(
  "the section {string} says {string}",
  function (this: SpecWorld, bookmark: string, words: string) {
    const section = sectionOf(this, bookmark);
    assert.ok(section.includes(words), `${bookmark} does not say ${words}.`);
  },
);

Then(
  "the section {string} says {string} before {string}",
  function (this: SpecWorld, bookmark: string, first: string, second: string) {
    const section = sectionOf(this, bookmark);
    const at = section.indexOf(first);
    assert.ok(at !== -1, `${bookmark} does not say ${first}.`);
    assert.ok(
      section.indexOf(second, at + first.length) !== -1,
      `${bookmark} does not say ${second} after ${first}.`,
    );
  },
);

Then(
  "the section {string} does not say {string}",
  function (this: SpecWorld, bookmark: string, words: string) {
    const section = sectionOf(this, bookmark);
    assert.ok(!section.includes(words), `${bookmark} says ${words}.`);
  },
);

Then("the help page says {string}", function (this: SpecWorld, words: string) {
  assert.ok(wordsIn(html(this)).includes(words), `It does not say ${words}.`);
});
