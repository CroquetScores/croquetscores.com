import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { askFor, pageAsked, theSite } from "../../support/publicPages.js";

// What was answered last, whichever step asked: the sitemap is asked for here
// and the robots file in the search engines' feature, which both keep it.
const bodyOf = (world: SpecWorld): string => {
  assert.ok(world.answeredWith !== undefined, "Nothing has been asked for.");
  return world.answeredWith.body;
};

const located = (world: SpecWorld): string[] =>
  [...bodyOf(world).matchAll(/<loc>([^<]*)<\/loc>/g)].map((found) =>
    found[1]!.replace(/&amp;/g, "&"),
  );

When(
  "the sitemap is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await askFor(this, "/sitemap.xml", address);
  },
);

When(
  "the sitemap {string} is asked for at {string}",
  async function (this: SpecWorld, name: string, address: string) {
    await askFor(this, `/${name}`, address);
  },
);

// Made up rather than kept, so that there is no need for fifty thousand
// tournaments in a database: the pages are the home page, a year and a sport
// in it, and tournaments to make up the rest.
Given(
  "a website with {int} pages to list",
  async function (this: SpecWorld, pages: number) {
    const tournaments = Math.max(pages - 3, 0);
    await theSite(
      this,
      Array.from(
        { length: tournaments },
        (_, at) => `2026/ac/tournament-${String(at + 1)}`,
      ),
    );
  },
);

Then("it is an XML sitemap", function (this: SpecWorld) {
  assert.match(pageAsked(this).headers.get("content-type") ?? "", /xml/);
  assert.ok(bodyOf(this).includes("<urlset"));
});

Then("it is an XML sitemap index", function (this: SpecWorld) {
  assert.ok(bodyOf(this).includes("<sitemapindex"));
});

Then("it lists {string}", function (this: SpecWorld, address: string) {
  assert.ok(located(this).includes(address), `${address} is not listed.`);
});

Then("it does not list {string}", function (this: SpecWorld, address: string) {
  assert.ok(!located(this).includes(address), `${address} is listed.`);
});

Then("it lists {string} once", function (this: SpecWorld, address: string) {
  assert.equal(located(this).filter((each) => each === address).length, 1);
});

Then("it lists {int} pages", function (this: SpecWorld, count: number) {
  assert.equal(located(this).length, count);
});

Then("it lists {int} page", function (this: SpecWorld, count: number) {
  assert.equal(located(this).length, count);
});

// An index names its sitemaps and a robots file names the one, each in its
// own way, and what is said of either is said in these words.
Then(
  "it names the sitemap {string}",
  function (this: SpecWorld, address: string) {
    const body = bodyOf(this);
    assert.ok(
      located(this).includes(address) || body.includes(`Sitemap: ${address}`),
      `${address} is not named.`,
    );
  },
);

Then("it names no sitemap", function (this: SpecWorld) {
  assert.ok(!bodyOf(this).includes("Sitemap:"));
});
