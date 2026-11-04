import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { makeHelpSearchIndex } from "../../../../src/application/operations/help/MakeHelpSearchIndex.js";
import type {
  HelpPageToSearch,
  HelpPagesToSearch,
  HelpSearchResult,
} from "../../../../src/application/services/HelpSearchIndex.js";
import { PostgresHelpSearchIndex } from "../../../../src/infrastructure/database/PostgresHelpSearchIndex.js";
import { helpSearchRulesOf } from "../../../../src/web/common/helpSearchConfigurations.js";
import { languageOf } from "../../../web/common/help-search/helpFolders.js";
import type { SpecWorld } from "../../../support/world.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What the built help holds, as the scenario has said, and what became of
// making the index from it.
interface Help {
  readonly index: PostgresHelpSearchIndex;
  pages: HelpPageToSearch[];
  unreadable: boolean;
  failure?: unknown;
  madeAgain?: boolean;
  results: readonly HelpSearchResult[];
}

const helps = new WeakMap<SpecWorld, Help>();

const helpOf = (world: SpecWorld): Help => {
  const help = helps.get(world);
  assert.ok(help !== undefined, "There is no index of the help.");
  return help;
};

Given("an index of the help", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  // Made as a request being served makes it, so that it is in a transaction.
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  helps.set(this, {
    index: new PostgresHelpSearchIndex(unitOfWork),
    pages: [],
    unreadable: false,
    results: [],
  });
});

const written = async (
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
const keep = (help: Help, page: HelpPageToSearch): void => {
  help.pages = [
    ...help.pages.filter(
      (each) => each.tag !== page.tag || each.name !== page.name,
    ),
    page,
  ];
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
    keep(helpOf(this), await written(folder, name, title, [], text));
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
    keep(helpOf(this), await written(folder, name, title, [heading], text));
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
      keep(
        helpOf(this),
        await written(folder, `page-${each}`, `Page ${each}`, [], text),
      );
    }
  },
);

Given(
  "the help has no {word} page {string}",
  async function (this: SpecWorld, folder: string, name: string) {
    const { tag } = await languageOf(folder);
    const help = helpOf(this);
    help.pages = help.pages.filter(
      (each) => each.tag !== tag || each.name !== name,
    );
  },
);

Given("a help that cannot be read", function (this: SpecWorld) {
  helpOf(this).unreadable = true;
});

Given("a help with no pages", function (this: SpecWorld) {
  helpOf(this).pages = [];
});

// A failure is kept for the step that names it, rather than thrown, so that a
// scenario can be about what the failure left behind.
When("the index is made", async function (this: SpecWorld) {
  const help = helpOf(this);
  const source: HelpPagesToSearch = {
    all: () =>
      help.unreadable
        ? Promise.reject(new Error("The help cannot be read."))
        : Promise.resolve(help.pages),
  };
  help.failure = undefined;
  try {
    help.madeAgain = await this.asARequest(() =>
      makeHelpSearchIndex(source, help.index),
    );
  } catch (failure) {
    help.failure = failure;
  }
});

Then(
  "the index is made with the error {string}",
  function (this: SpecWorld, code: string) {
    const failure = helpOf(this).failure as { code?: string } | undefined;
    assert.equal(failure?.code, code);
  },
);

Then("the index was made again", function (this: SpecWorld) {
  assert.equal(helpOf(this).madeAgain, true);
});

Then("the index was not made again", function (this: SpecWorld) {
  assert.equal(helpOf(this).madeAgain, false);
});

// Searching ----------------------------------------------------------------------

// Quoted as helpSynonyms.ts quotes what it searches for.
When(
  "{string} is searched for in {word}",
  async function (this: SpecWorld, word: string, folder: string) {
    const help = helpOf(this);
    const { tag } = await languageOf(folder);
    const rules = helpSearchRulesOf(tag);
    assert.ok(rules !== undefined, `${folder} has no way to be searched.`);
    help.results = await this.asARequest(() =>
      help.index.search(tag, rules, `'${word}'`),
    );
  },
);

const resultAt = (world: SpecWorld, at: number): HelpSearchResult => {
  const result = helpOf(world).results[at];
  assert.ok(result !== undefined, `There is no result number ${at + 1}.`);
  return result;
};

Then(
  "the first result is the page {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 0).name, name);
  },
);

Then(
  "the second result is the page {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 1).name, name);
  },
);

Then("there is one result", function (this: SpecWorld) {
  assert.equal(helpOf(this).results.length, 1);
});

Then("there are no results", function (this: SpecWorld) {
  assert.equal(helpOf(this).results.length, 0);
});

Then("there are {int} results", function (this: SpecWorld, count: number) {
  assert.equal(helpOf(this).results.length, count);
});

Then(
  "the title of the first result is {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(resultAt(this, 0).title, title);
  },
);

Then(
  "the page of the first result is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 0).name, name);
  },
);

Then(
  "the snippet of the first result says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(resultAt(this, 0).snippet.includes(words));
  },
);

Then(
  "the score of the first result is more than {int}",
  function (this: SpecWorld, least: number) {
    assert.ok(resultAt(this, 0).score > least);
  },
);
