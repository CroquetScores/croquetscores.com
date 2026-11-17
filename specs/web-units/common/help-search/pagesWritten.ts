// The pages of the help a scenario has written, for the features that search
// them: the index's, which makes its index of them, and the site's, which is
// given them to search. Kept once, with the steps that write them, because two
// definitions of the same words leave Cucumber unable to choose between them.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { HelpPageToSearch } from "../../../../src/application/services/HelpSearchIndex.js";
import { helpSearchRulesOf } from "../../../../src/web/common/helpSearchConfigurations.js";
import type { SpecWorld } from "../../../support/world.js";
import { languageOf } from "./helpFolders.js";

const written = new WeakMap<SpecWorld, HelpPageToSearch[]>();

/** The pages the scenario has written so far; the list itself, so that it can be changed. */
export const pagesOf = (world: SpecWorld): HelpPageToSearch[] => {
  let pages = written.get(world);
  if (pages === undefined) {
    pages = [];
    written.set(world, pages);
  }
  return pages;
};

const page = async (
  folder: string,
  name: string,
  title: string,
  headings: readonly string[],
  text: string,
): Promise<HelpPageToSearch> => {
  const { tag } = await languageOf(folder);
  const rules = helpSearchRulesOf(tag);
  assert.ok(rules !== undefined, `${folder} has no way to be searched.`);
  return { tag, rules, name, title, headings, text };
};

// A page written again under the name it had is the page changed, not a
// second page.
const keep = (world: SpecWorld, each: HelpPageToSearch): void => {
  const pages = pagesOf(world);
  const at = pages.findIndex(
    (kept) => kept.tag === each.tag && kept.name === each.name,
  );
  if (at === -1) pages.push(each);
  else pages[at] = each;
};

Given(
  "the {word} page {string} titled {string} saying {string}",
  async function (
    this: SpecWorld,
    folder: string,
    name: string,
    title: string,
    text: string,
  ) {
    keep(this, await page(folder, name, title, [], text));
  },
);

Given(
  "the {word} page {string} titled {string} with the heading {string} saying {string}",
  async function (
    this: SpecWorld,
    folder: string,
    name: string,
    title: string,
    heading: string,
    text: string,
  ) {
    keep(this, await page(folder, name, title, [heading], text));
  },
);

Given(
  "{int} {word} pages saying {string}",
  async function (
    this: SpecWorld,
    count: number,
    folder: string,
    text: string,
  ) {
    for (let each = 1; each <= count; each++) {
      keep(this, await page(folder, `page-${each}`, `Page ${each}`, [], text));
    }
  },
);
