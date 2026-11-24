// The public API's list of the sports a site offers (sports.feature), asked as
// an app asks: plain requests, with the key as a bearer token when it has one.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, asked, bearer, keyMade, sceneOf } from "../apiOfApps.js";

const path = "/api/v1/tournaments/sports";

// Asked of the site the scenario said it was served as, which `asked` does not
// say on its own: it sends only the key.
const askedOfTheSite = (
  world: WebWorld,
  headers: Record<string, string>,
  at: string = path,
): Promise<unknown> => asked(world, at, { ...world.extraHeaders, ...headers });

When("the sports are asked with that key", async function (this: WebWorld) {
  sceneOf(this).earlier = undefined;
  await askedOfTheSite(this, bearer(keyMade(this)));
});

When("the sports are asked with no key", async function (this: WebWorld) {
  await askedOfTheSite(this, {});
});

When(
  "the sports are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await askedOfTheSite(this, bearer(key));
  },
);

When(
  "the sports are asked with no key in the language {string}",
  async function (this: WebWorld, language: string) {
    const asks = new URLSearchParams({ language }).toString();
    await askedOfTheSite(this, {}, `${path}?${asks}`);
  },
);

When(
  "the sports are asked with no key in the languages {string} and {string}",
  async function (this: WebWorld, one: string, other: string) {
    const asks = new URLSearchParams([
      ["language", one],
      ["language", other],
    ]).toString();
    await askedOfTheSite(this, {}, `${path}?${asks}`);
  },
);

// What a browser sends of itself, which the API is not to go by.
When(
  "the sports are asked with no key, the browser preferring {string}",
  async function (this: WebWorld, language: string) {
    await askedOfTheSite(this, { "accept-language": language });
  },
);

// With the mark of the first full answer, since a 304 repeats none.
When(
  "the sports are asked again with no key and the mark it gave",
  async function (this: WebWorld) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await askedOfTheSite(this, { "if-none-match": mark });
  },
);

Given("the mark of the answer is kept", function (this: WebWorld) {
  sceneOf(this).earlier = answered(this);
});

Then("the API gives a mark other than the one kept", function (this: WebWorld) {
  const kept = sceneOf(this).earlier?.headers.get("etag");
  assert.ok(kept !== undefined && kept !== null, "No mark was kept.");
  const now = answered(this).headers.get("etag");
  assert.ok(now !== null, "The API gave no mark.");
  assert.notEqual(now, kept);
});

interface Listed {
  readonly [field: string]: unknown;
}

const listed = (world: WebWorld): readonly Listed[] => {
  const { sports } = answered(world).body;
  assert.ok(Array.isArray(sports), "The API listed no sports.");
  return sports as Listed[];
};

const codeAt = (world: WebWorld, index: number): unknown =>
  listed(world)[index]?.["code"];

Then("the first sport is {string}", function (this: WebWorld, code: string) {
  assert.equal(codeAt(this, 0), code);
});

Then("the second sport is {string}", function (this: WebWorld, code: string) {
  assert.equal(codeAt(this, 1), code);
});

Then("the third sport is {string}", function (this: WebWorld, code: string) {
  assert.equal(codeAt(this, 2), code);
});

Then("the fourth sport is {string}", function (this: WebWorld, code: string) {
  assert.equal(codeAt(this, 3), code);
});

Then("there is/are {int} sport(s)", function (this: WebWorld, count: number) {
  assert.equal(listed(this).length, count);
});

Then(
  "the sport {string} is named {string}",
  function (this: WebWorld, code: string, name: string) {
    const found = listed(this).find((each) => each["code"] === code);
    assert.ok(found !== undefined, `${code} was not listed.`);
    assert.equal(found["name"], name);
  },
);
