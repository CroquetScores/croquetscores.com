// The public API's list of countries and their regions (countries.feature),
// asked as an app asks: plain requests, with the key as a bearer token when it
// has one.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, asked, bearer, keyMade, sceneOf } from "../apiOfApps.js";

const pathOf = (language?: string): string =>
  language === undefined
    ? "/api/v1/countries"
    : `/api/v1/countries?${new URLSearchParams({ language }).toString()}`;

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When("the countries are asked with that key", async function (this: WebWorld) {
  sceneOf(this).earlier = undefined;
  await asked(this, pathOf(), withThatKey(this));
});

When("the countries are asked with no key", async function (this: WebWorld) {
  await asked(this, pathOf(), {});
});

When(
  "the countries are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, pathOf(), bearer(key));
  },
);

When(
  "the countries are asked with that key in the language {string}",
  async function (this: WebWorld, language: string) {
    await asked(this, pathOf(language), withThatKey(this));
  },
);

When(
  "the countries are asked with that key and the header language {string}",
  async function (this: WebWorld, language: string) {
    await asked(this, pathOf(), {
      ...withThatKey(this),
      "accept-language": language,
      cookie: `language=${language}`,
    });
  },
);

// With the mark of the first full answer, since a 304 repeats none.
const askedAgainWithTheMark = async (world: WebWorld): Promise<void> => {
  const scene = sceneOf(world);
  const earlier = scene.earlier ?? answered(world);
  scene.earlier = earlier;
  const mark = earlier.headers.get("etag");
  assert.ok(mark !== null, "The API gave no mark.");
  await asked(world, pathOf(), {
    ...withThatKey(world),
    "if-none-match": mark,
  });
};

When(
  "the countries are asked again with that key and the mark it gave",
  async function (this: WebWorld) {
    await askedAgainWithTheMark(this);
  },
);

interface Region {
  readonly code: unknown;
  readonly name: unknown;
}

interface Country {
  readonly code: unknown;
  readonly name: unknown;
  readonly regions: readonly Region[];
}

const listed = (world: WebWorld): readonly Country[] => {
  const { countries } = answered(world).body;
  assert.ok(Array.isArray(countries), "The API listed no countries.");
  return countries as Country[];
};

const named = (world: WebWorld, name: string): Country => {
  const found = listed(world).find((each) => each.name === name);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then(
  "the country {string} says its code is {string}",
  function (this: WebWorld, name: string, code: string) {
    assert.equal(named(this, name).code, code);
  },
);

Then(
  "the country {string} lists the region {string}",
  function (this: WebWorld, name: string, region: string) {
    assert.ok(
      named(this, name).regions.some((each) => each.name === region),
      `${name} lists no region ${region}.`,
    );
  },
);

Then(
  "the region {string} of {string} says its code is {string}",
  function (this: WebWorld, region: string, country: string, code: string) {
    const found = named(this, country).regions.find(
      (each) => each.name === region,
    );
    assert.ok(found !== undefined, `${country} lists no region ${region}.`);
    assert.equal(found.code, code);
  },
);

// Swedish puts Ö, Ä and Å after Z where English puts them with O, A and A, so
// that a list placed by the wrong language's rules is told apart from one that
// is not. Two languages that happen to place a pair alike would not.
Then(
  "the country {string} is listed after the country {string}",
  function (this: WebWorld, later: string, earlier: string) {
    const names = listed(this).map((each) => each.name);
    assert.ok(
      names.indexOf(later) > names.indexOf(earlier),
      `${later} is not after ${earlier}.`,
    );
  },
);

const marksKept = new WeakMap<WebWorld, string | null>();

Given("the mark of the countries answer is kept", function (this: WebWorld) {
  marksKept.set(this, answered(this).headers.get("etag"));
});

Then("the answer's mark is not the mark kept", function (this: WebWorld) {
  const kept = marksKept.get(this);
  assert.ok(kept, "No mark was kept.");
  assert.notEqual(answered(this).headers.get("etag"), kept);
});

// Asked with no language, so in English, which is how the answer is placed.
Then(
  "the countries are in the order of their names",
  function (this: WebWorld) {
    const names = listed(this).map((each) => String(each.name));
    const english = new Intl.Collator("en");
    assert.deepEqual(
      names,
      [...names].sort((one, other) => english.compare(one, other)),
    );
  },
);
