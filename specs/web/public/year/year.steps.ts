import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { rows } from "../../support/tournamentLists.js";

// What is a year's page's own. What its list shares with the home page's is
// said in specs/web-units/support/tournamentLists.ts.

const openYear = async function (this: WebWorld, year: number): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/${String(year)}`);
};

Given("the page for {int} is open", openYear);
When("the page for {int} is opened", openYear);

When(
  /^the page for (\d{4}) is opened for the (country|sport) "(.*)"$/,
  async function (this: WebWorld, year: string, chosen: string, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/${year}?${new URLSearchParams({ [chosen]: code }).toString()}`,
    );
  },
);

Then(
  /^(\d+) of the year's tournaments (?:is|are) listed$/,
  async function (this: WebWorld, count: string) {
    assert.equal(await rows(this, "year's tournaments").count(), Number(count));
  },
);
