import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { rows } from "../../support/tournamentLists.js";

// What is a sport's page in a year's own. What its list shares with the home
// page's and a year's is said in specs/web/support/tournamentLists.ts.

const openSportInYear = async function (
  this: SpecWorld,
  sport: string,
  year: number,
): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/${String(year)}/${sport}`);
};

Given("the page for {string} in {int} is open", openSportInYear);
When("the page for {string} in {int} is opened", openSportInYear);

When(
  "the page for {string} in {int} is opened for the country {string}",
  async function (this: SpecWorld, sport: string, year: number, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/${String(year)}/${sport}?${new URLSearchParams({ country: code }).toString()}`,
    );
  },
);

Then(
  /^(\d+) of the sport's tournaments (?:is|are) listed$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(
      await rows(this, "sport's tournaments").count(),
      Number(count),
    );
  },
);
