// The page where an administrator reads the tournaments played in countries
// the world rankings do not list (countries.feature), in a real browser. The
// rows are filled in once the API has answered, so every step waits for what it
// looks at.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { call } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const PLACES = ["first", "second"];
const PLACE = "(first|second)";

const rowAt = (world: WebWorld, place: string): Locator =>
  world.browserPage
    .locator("main ul.countries > li.country-tournament-row")
    .nth(PLACES.indexOf(place));

Then(
  new RegExp(`^the ${PLACE} row's tournament is "([^"]*)"$`),
  async function (this: WebWorld, place: string, name: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, place)
          .locator(".country-tournament")
          .innerText({ timeout: 100 }),
        name,
      );
    });
  },
);

Then(
  new RegExp(`^the ${PLACE} row's country is "([^"]*)"$`),
  async function (this: WebWorld, place: string, name: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, place)
          .locator(".country-name")
          .innerText({ timeout: 100 }),
        name,
      );
    });
  },
);

Then(
  new RegExp(`^the ${PLACE} row's link to the old site leads to "([^"]*)"$`),
  async function (this: WebWorld, place: string, address: string) {
    await eventually(async () => {
      assert.equal(
        await rowAt(this, place)
          .locator("a.country-old-site")
          .getAttribute("href", { timeout: 100 }),
        address,
      );
    });
  },
);

Then(
  "the page says no tournament is played in a country the lists do not name",
  async function (this: WebWorld) {
    await this.browserPage
      .locator("main [data-none]")
      .waitFor({ timeout: 3000 });
    assert.equal(
      await this.browserPage
        .locator("main ul.countries > li.country-tournament-row")
        .count(),
      0,
    );
  },
);

// The countries the world rankings' lists name, said to the site, which knows
// none until it is told.
Given(
  /^the (Association Croquet|Golf Croquet) world rankings list names the country "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    const answer = await call("POST", "/world-ranking-countries", {
      sport: which === "Association Croquet" ? "ac" : "gc",
      country: name,
    });
    assert.equal(answer.status, 201, await answer.text());
  },
);
