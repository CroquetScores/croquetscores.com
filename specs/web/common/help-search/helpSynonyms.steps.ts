import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  expandQuestion,
  helpSynonymsOf,
  type ExpandedQuestion,
  type HelpSynonyms,
} from "../../../../src/web/common/helpSynonyms.js";
import type { SpecWorld } from "../../../support/world.js";
import { folders, languageOf } from "./helpFolders.js";

const pairs = new WeakMap<SpecWorld, [string, string][]>();
const questions = new WeakMap<SpecWorld, string>();
const expanded = new WeakMap<SpecWorld, ExpandedQuestion>();
const listed = new WeakMap<SpecWorld, ReadonlyMap<string, HelpSynonyms>>();

Given(
  "the synonym {string} for {string}",
  function (this: SpecWorld, first: string, second: string) {
    const held = pairs.get(this) ?? [];
    held.push([first, second]);
    pairs.set(this, held);
  },
);

Given("the question {string}", function (this: SpecWorld, question: string) {
  questions.set(this, question);
});

When("the question is expanded", function (this: SpecWorld) {
  const question = questions.get(this);
  assert.ok(question !== undefined, "No question was asked.");
  expanded.set(this, expandQuestion(question, pairs.get(this) ?? []));
});

const result = (world: SpecWorld): ExpandedQuestion => {
  const found = expanded.get(world);
  assert.ok(found !== undefined, "No question was expanded.");
  return found;
};

Then(
  "the words searched for include {string}",
  function (this: SpecWorld, word: string) {
    assert.ok(
      result(this).words.includes(word),
      `${word} is not among ${result(this).words.join(", ")}.`,
    );
  },
);

Then("there are no words to search for", function (this: SpecWorld) {
  assert.deepEqual(result(this).words, []);
  assert.equal(result(this).query, "");
});

// A symbol reaching Postgres in a query is an error, or worse a different
// question. What is accepted is that none of them is left in what is sent.
Then("the question is accepted", function (this: SpecWorld) {
  assert.match(result(this).query, /^('[\p{L}\p{N}]+'( \| )?)*$/u);
});

When("the synonyms of each are looked for", async function (this: SpecWorld) {
  const found = new Map<string, HelpSynonyms>();
  for (const folder of folders.get(this) ?? []) {
    const own = helpSynonymsOf((await languageOf(folder)).tag);
    if (own !== undefined) found.set(folder, own);
  }
  listed.set(this, found);
});

Then("every folder has a list of synonyms", function (this: SpecWorld) {
  const each = listed.get(this);
  const wanted = folders.get(this) ?? [];
  assert.ok(wanted.length > 0, "No folder was looked at.");
  for (const folder of wanted) {
    assert.ok(each?.has(folder) === true, `${folder} has no list.`);
  }
});
