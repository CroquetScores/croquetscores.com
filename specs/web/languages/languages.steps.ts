import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Language } from "../../../src/web/common/language.js";
import { afrikaans } from "../../../src/web/languages/afrikaans.js";
import { chinese } from "../../../src/web/languages/chinese.js";
import { dutch } from "../../../src/web/languages/dutch.js";
import { egyptian } from "../../../src/web/languages/egyptian.js";
import { english } from "../../../src/web/languages/english.js";
import { french } from "../../../src/web/languages/french.js";
import { german } from "../../../src/web/languages/german.js";
import { italian } from "../../../src/web/languages/italian.js";
import { japanese } from "../../../src/web/languages/japanese.js";
import { korean } from "../../../src/web/languages/korean.js";
import { maori } from "../../../src/web/languages/maori.js";
import { polish } from "../../../src/web/languages/polish.js";
import { portuguese } from "../../../src/web/languages/portuguese.js";
import { russian } from "../../../src/web/languages/russian.js";
import { spanish } from "../../../src/web/languages/spanish.js";
import { swedish } from "../../../src/web/languages/swedish.js";
import { welsh } from "../../../src/web/languages/welsh.js";
import type { SpecWorld } from "../../support/world.js";
import { anApplicationOfferingItsOwnLanguages } from "../support/browser.js";

// Every catalogue a feature in this folder can name, by its name in English,
// which is how the steps say it. A language's own feature names its own and
// no other, so that adding a language is a file here and a feature beside it.
const known: Readonly<Record<string, Language>> = {
  English: english,
  Spanish: spanish,
  Afrikaans: afrikaans,
  Chinese: chinese,
  Dutch: dutch,
  Egyptian: egyptian,
  French: french,
  German: german,
  Italian: italian,
  Japanese: japanese,
  Korean: korean,
  Maori: maori,
  Polish: polish,
  Portuguese: portuguese,
  Russian: russian,
  Swedish: swedish,
  Welsh: welsh,
};

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

Given("the {word} catalogue", function (this: SpecWorld, name: string) {
  const language = known[name];
  if (language === undefined) throw new Error(`No ${name} catalogue is known.`);
  inHand(this).set(name, language);
});

// Every entry missing, named, so that a failure says which to write rather
// than only that some are.
const missingFrom = (from: Language, to: Language): string[] =>
  Object.keys(from.words).filter((key) => !(key in to.words));

Then(
  "every entry in English has one in {word}",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(
      missingFrom(catalogue(this, "English"), catalogue(this, name)),
      [],
    );
  },
);

Then(
  "every entry in {word} has one in English",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(
      missingFrom(catalogue(this, name), catalogue(this, "English")),
      [],
    );
  },
);

// What an entry fills in, as a set: how often, and in what order, is each
// language's own business.
const fillsIn = (words: string): string =>
  [...new Set(words.match(/\{\w+\}/g) ?? [])].sort().join(" ");

Then(
  "every entry in {word} fills in the same things as its English one",
  function (this: SpecWorld, name: string) {
    const english = catalogue(this, "English").words;
    const other = catalogue(this, name).words;
    const differing = Object.keys(other).filter(
      (key) =>
        english[key] !== undefined &&
        fillsIn(other[key]!) !== fillsIn(english[key]),
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

// What the page says about the way it is read, which a browser lays the whole
// page out by.
const direction = (world: SpecWorld): Promise<string> =>
  world.browserPage.evaluate<string>("document.documentElement.dir");

Then("the page reads from right to left", async function (this: SpecWorld) {
  assert.equal(await direction(this), "rtl");
});

Then("the page reads from left to right", async function (this: SpecWorld) {
  assert.notEqual(await direction(this), "rtl");
});

// Said on each language in the list, so that its name reads the way its own
// language does whichever way the page around it is read.
const offeredReading = async (
  world: SpecWorld,
  tag: string,
): Promise<string | null> => {
  const offered = world.browserPage.locator(
    `form.language select option[value=${JSON.stringify(tag)}]`,
  );
  assert.equal(await offered.count(), 1, `${tag} is not offered.`);
  return offered.getAttribute("dir");
};

Then(
  "the language {string} is offered reading from right to left",
  async function (this: SpecWorld, tag: string) {
    assert.equal(await offeredReading(this, tag), "rtl");
  },
);

Then(
  "the language {string} is offered reading from left to right",
  async function (this: SpecWorld, tag: string) {
    assert.equal(await offeredReading(this, tag), "ltr");
  },
);
