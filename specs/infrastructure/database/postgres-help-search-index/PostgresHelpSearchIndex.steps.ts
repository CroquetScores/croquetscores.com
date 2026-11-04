import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { makeHelpSearchIndex } from "../../../../src/application/operations/help/MakeHelpSearchIndex.js";
import type { HelpPagesToSearch } from "../../../../src/application/services/HelpSearchIndex.js";
import { PostgresHelpSearchIndex } from "../../../../src/infrastructure/database/PostgresHelpSearchIndex.js";
import { helpSearchRulesOf } from "../../../../src/web/common/helpSearchConfigurations.js";
import { languageOf } from "../../../web/common/help-search/helpFolders.js";
import { pagesOf } from "../../../web/common/help-search/pagesWritten.js";
import { keepResults } from "../../../web/common/help-search/results.js";
import type { SpecWorld } from "../../../support/world.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What the built help holds, as the scenario has said, and what became of
// making the index from it.
interface Help {
  readonly index: PostgresHelpSearchIndex;
  unreadable: boolean;
  /** Whether the pages are listed from the last to the first. */
  backwards: boolean;
  failure?: unknown;
  madeAgain?: boolean;
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
    unreadable: false,
    backwards: false,
  });
});

Given(
  "the {word} page {string} is no longer in the help",
  async function (this: SpecWorld, folder: string, name: string) {
    const { tag } = await languageOf(folder);
    const pages = pagesOf(this);
    const at = pages.findIndex(
      (each) => each.tag === tag && each.name === name,
    );
    if (at !== -1) pages.splice(at, 1);
  },
);

// What a restore, a truncate, or a hand in the database does to the pages kept.
Given("the pages kept are lost", async function (this: SpecWorld) {
  await this.asARequest(() =>
    unitOfWorkOf(this).connection().query("delete from help_search_pages"),
  );
});

Given(
  "the page kept as {string} is lost",
  async function (this: SpecWorld, name: string) {
    await this.asARequest(() =>
      unitOfWorkOf(this)
        .connection()
        .query("delete from help_search_pages where name = $1", [name]),
    );
  },
);

Given("a help that cannot be read", function (this: SpecWorld) {
  helpOf(this).unreadable = true;
});

Given("the pages are listed the other way round", function (this: SpecWorld) {
  helpOf(this).backwards = true;
});

Given("a help with no pages", function (this: SpecWorld) {
  pagesOf(this).length = 0;
});

// A failure is kept for the step that names it, rather than thrown, so that a
// scenario can be about what the failure left behind.
When("the index is made", async function (this: SpecWorld) {
  const help = helpOf(this);
  const source: HelpPagesToSearch = {
    all: () =>
      help.unreadable
        ? Promise.reject(new Error("The help cannot be read."))
        : Promise.resolve(
            help.backwards ? [...pagesOf(this)].reverse() : pagesOf(this),
          ),
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
    keepResults(
      this,
      await this.asARequest(() => help.index.search(tag, rules, `'${word}'`)),
    );
  },
);
