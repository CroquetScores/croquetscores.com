// The public API's list of the formats a tournament may be played in
// (formats.feature), asked as an app asks: plain requests, with the key as a
// bearer token when it has one.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, asked, bearer, keyMade, sceneOf } from "../apiOfApps.js";

const path = "/api/v0/tournaments/formats";

When("the formats are asked with that key", async function (this: WebWorld) {
  sceneOf(this).earlier = undefined;
  await asked(this, path, bearer(keyMade(this)));
});

When("the formats are asked with no key", async function (this: WebWorld) {
  await asked(this, path, {});
});

When(
  "the formats are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, path, bearer(key));
  },
);

When(
  "the formats are asked with that key in the language {string}",
  async function (this: WebWorld, language: string) {
    await asked(this, path, {
      ...bearer(keyMade(this)),
      "accept-language": language,
    });
  },
);

When(
  "the formats are asked with that key and the language {string}",
  async function (this: WebWorld, language: string) {
    await asked(
      this,
      `${path}?${new URLSearchParams({ language }).toString()}`,
      bearer(keyMade(this)),
    );
  },
);

// Said twice, as a caller that builds its address from two settings might.
When(
  "the formats are asked with that key and the languages {string} and {string}",
  async function (this: WebWorld, first: string, second: string) {
    await asked(
      this,
      `${path}?language=${encodeURIComponent(first)}&language=${encodeURIComponent(second)}`,
      bearer(keyMade(this)),
    );
  },
);

When(
  "the formats are asked with that key and the language {string} in the language {string}",
  async function (this: WebWorld, language: string, browser: string) {
    await asked(
      this,
      `${path}?${new URLSearchParams({ language }).toString()}`,
      { ...bearer(keyMade(this)), "accept-language": browser },
    );
  },
);

// As something in front of the site would say which website was asked for,
// since the host of a plain request is the machine the specs run on.
When(
  "the formats are asked with that key on the site {string}",
  async function (this: WebWorld, host: string) {
    await asked(this, path, {
      ...bearer(keyMade(this)),
      "x-forwarded-host": host,
    });
  },
);

// With the mark of the first full answer, since a 304 repeats none.
When(
  "the formats are asked again with that key and the mark it gave",
  async function (this: WebWorld) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, path, {
      ...bearer(keyMade(this)),
      "if-none-match": mark,
    });
  },
);

interface Listed {
  readonly [field: string]: unknown;
}

const listed = (world: WebWorld): readonly Listed[] => {
  const { formats } = answered(world).body;
  assert.ok(Array.isArray(formats), "The API listed no formats.");
  return formats as Listed[];
};

const coded = (world: WebWorld, code: string): Listed => {
  const found = listed(world).find((each) => each["code"] === code);
  assert.ok(found !== undefined, `${code} was not listed.`);
  return found;
};

Then("{int} format(s) is/are listed", function (this: WebWorld, count: number) {
  assert.equal(listed(this).length, count);
});

Then("the format {string} is listed", function (this: WebWorld, code: string) {
  coded(this, code);
});

Then(
  "the first format listed is {string}",
  function (this: WebWorld, code: string) {
    assert.equal(listed(this)[0]?.["code"], code);
  },
);

Then(
  "the format {string} says its name is {string}",
  function (this: WebWorld, code: string, name: string) {
    assert.equal(coded(this, code)["name"], name);
  },
);

Then(
  "the format {string} says it is played by teams",
  function (this: WebWorld, code: string) {
    assert.equal(coded(this, code)["teams"], true);
  },
);

Then(
  "the format {string} says it is not played by teams",
  function (this: WebWorld, code: string) {
    assert.equal(coded(this, code)["teams"], false);
  },
);

Then(
  "the format {string} says it draws a test level",
  function (this: WebWorld, code: string) {
    assert.equal(coded(this, code)["drawsLevelTests"], true);
  },
);

Then(
  "the format {string} says it does not draw a test level",
  function (this: WebWorld, code: string) {
    assert.equal(coded(this, code)["drawsLevelTests"], false);
  },
);

Then(
  "the API says the answer depends on the Accept-Language header",
  function (this: WebWorld) {
    assert.match(answered(this).headers.get("vary") ?? "", /Accept-Language/i);
  },
);

Then(
  "the API says the answer depends on the Cookie header",
  function (this: WebWorld) {
    assert.match(answered(this).headers.get("vary") ?? "", /Cookie/i);
  },
);
