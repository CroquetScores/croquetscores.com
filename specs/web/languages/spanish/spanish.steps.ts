import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Language } from "../../../../src/web/common/language.js";
import { english } from "../../../../src/web/languages/english.js";
import { spanish } from "../../../../src/web/languages/spanish.js";
import type { SpecWorld } from "../../../support/world.js";
import { anApplicationOfferingItsOwnLanguages } from "../../support/browser.js";

// The catalogues a scenario has in hand, by what they are called in its steps.
const catalogues = new WeakMap<SpecWorld, Map<string, Language>>();

const inHand = (world: SpecWorld): Map<string, Language> => {
  let held = catalogues.get(world);
  if (held === undefined) {
    held = new Map();
    catalogues.set(world, held);
  }
  return held;
};

const catalogue = (world: SpecWorld, name: string): Language => {
  const held = inHand(world).get(name);
  if (held === undefined) throw new Error(`No ${name} catalogue is in hand.`);
  return held;
};

Given("the English catalogue", function (this: SpecWorld) {
  inHand(this).set("English", english);
});

Given("the Spanish catalogue", function (this: SpecWorld) {
  inHand(this).set("Spanish", spanish);
});

// Every entry missing, named, so that a failure says which to write rather
// than only that some are.
const missingFrom = (from: Language, to: Language): string[] =>
  Object.keys(from.words).filter((key) => !(key in to.words));

Then("every entry in English has one in Spanish", function (this: SpecWorld) {
  assert.deepEqual(
    missingFrom(catalogue(this, "English"), catalogue(this, "Spanish")),
    [],
  );
});

Then("every entry in Spanish has one in English", function (this: SpecWorld) {
  assert.deepEqual(
    missingFrom(catalogue(this, "Spanish"), catalogue(this, "English")),
    [],
  );
});

// What an entry fills in, as a set: how often, and in what order, is each
// language's own business.
const fillsIn = (words: string): string =>
  [...new Set(words.match(/\{\w+\}/g) ?? [])].sort().join(" ");

Then(
  "every entry in Spanish fills in the same things as its English one",
  function (this: SpecWorld) {
    const english = catalogue(this, "English").words;
    const spanish = catalogue(this, "Spanish").words;
    const differing = Object.keys(spanish).filter(
      (key) =>
        english[key] !== undefined &&
        fillsIn(spanish[key]!) !== fillsIn(english[key]),
    );
    assert.deepEqual(differing, []);
  },
);

Given(
  "a site offering the languages it is served with",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationOfferingItsOwnLanguages(this);
  },
);
