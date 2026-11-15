import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { czech } from "../../../../src/web/languages/czech.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  askFor,
  metaContent,
  pageAsked,
  titleOf,
} from "../../support/publicPages.js";

// Kept for the steps that say a page says what another does.
const homeDescriptions = new WeakMap<SpecWorld, string>();

const descriptionOf = (world: SpecWorld): string => {
  const found = metaContent(world, "name", "description");
  assert.ok(found !== undefined, "The page has no description.");
  return found;
};

const previewOf = (world: SpecWorld, property: string): string => {
  const found = metaContent(world, "property", `og:${property}`);
  assert.ok(found !== undefined, `The preview has no ${property}.`);
  return found;
};

Then("its title is {string}", function (this: SpecWorld, title: string) {
  assert.equal(titleOf(this), title);
});

Then("its title ends with {string}", function (this: SpecWorld, end: string) {
  assert.ok(titleOf(this).endsWith(end), `${titleOf(this)} does not end so.`);
});

Then(
  "its description names {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(
      descriptionOf(this).includes(text),
      `${descriptionOf(this)} does not name ${text}.`,
    );
  },
);

Then(
  "its description does not name {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(
      !descriptionOf(this).toLowerCase().includes(text.toLowerCase()),
      `${descriptionOf(this)} names ${text}.`,
    );
  },
);

// The country as the language's own words say it, read from the language and
// not written out here, so that a change of its words is not a change of this.
Then(
  "its description names the country as it is said in {string}",
  function (this: SpecWorld, language: string) {
    assert.equal(language, "cs", "Only Czech is read here.");
    const said = czech.words["country.nz"];
    assert.ok(said !== undefined, "Czech has no word for New Zealand.");
    assert.ok(
      descriptionOf(this).includes(said),
      `${descriptionOf(this)} does not name ${said}.`,
    );
  },
);

Given(
  "the home page is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await askFor(this, "/", address);
    homeDescriptions.set(this, descriptionOf(this));
  },
);

Then("its description is the home page's", function (this: SpecWorld) {
  const home = homeDescriptions.get(this);
  assert.ok(home !== undefined, "The home page was not asked for.");
  assert.equal(descriptionOf(this), home);
});

Then(
  "its description is no longer than {int} characters",
  function (this: SpecWorld, most: number) {
    assert.ok([...descriptionOf(this)].length <= most);
  },
);

Then("its description ends with an ellipsis", function (this: SpecWorld) {
  assert.ok(descriptionOf(this).endsWith("…"));
});

// Cut between words: the last word left is a whole word of what the
// description was made from, and not the start of one. What it was made from
// is the tournament's name, its sport and the country it is played in, which
// the scenario says.
Then("its description is cut between two words", function (this: SpecWorld) {
  const kept = descriptionOf(this).slice(0, -1);
  const name = /<title>([^<]*) — /.exec(pageAsked(this).body)?.[1];
  assert.ok(name !== undefined, "The page has no title to read the name from.");
  const wholeWords = new Set(
    [
      name.replace(/&amp;/g, "&"),
      "Association Croquet",
      "South Georgia and the South Sandwich Islands",
    ]
      .join(" ")
      .split(" "),
  );
  const last = kept.split(" ").pop()!.replace(/,$/, "");
  assert.ok(wholeWords.has(last), `${last} is the start of a word.`);
  assert.ok(!kept.endsWith(" "), "The description ends in a space.");
});

Then("the page has no element made from the name", function (this: SpecWorld) {
  assert.ok(!pageAsked(this).body.includes("<b>Open</b>"));
});

Then(
  "its preview title is {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(previewOf(this, "title"), title);
  },
);

Then("its preview description is its description", function (this: SpecWorld) {
  assert.equal(previewOf(this, "description"), descriptionOf(this));
});

Then(
  "its preview address is {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(previewOf(this, "url"), address);
  },
);

Then("its preview type is {string}", function (this: SpecWorld, type: string) {
  assert.equal(previewOf(this, "type"), type);
});

Then("its preview site is {string}", function (this: SpecWorld, site: string) {
  assert.equal(previewOf(this, "site_name"), site);
});

Then(
  "its preview language is {string}",
  function (this: SpecWorld, locale: string) {
    assert.equal(previewOf(this, "locale"), locale);
  },
);

Then("it has no preview picture", function (this: SpecWorld) {
  assert.equal(metaContent(this, "property", "og:image"), undefined);
});

Then("its card is a summary", function (this: SpecWorld) {
  assert.equal(metaContent(this, "name", "twitter:card"), "summary");
});

Then("it has no description", function (this: SpecWorld) {
  assert.equal(metaContent(this, "name", "description"), undefined);
});

Then("it has no preview", function (this: SpecWorld) {
  assert.equal(metaContent(this, "property", "og:title"), undefined);
});
