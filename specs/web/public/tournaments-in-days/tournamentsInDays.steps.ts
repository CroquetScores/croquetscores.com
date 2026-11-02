import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { rows } from "../../support/tournamentLists.js";

// What is this page's own. What its list shares with the home page's and a
// year's is said in specs/web/support/tournamentLists.ts.

// The address the page is at, with whatever of the days and the page a scenario
// said, written as an address writes them.
const addressOf = (
  world: SpecWorld,
  said: { from?: string; to?: string; page?: number },
): string => {
  const query = new URLSearchParams();
  if (said.from !== undefined) query.set("from", said.from);
  if (said.to !== undefined) query.set("to", said.to);
  if (said.page !== undefined) query.set("page", String(said.page));
  const written = query.toString();
  return `${world.baseUrl!}/tournaments${written === "" ? "" : `?${written}`}`;
};

const open = async (
  world: SpecWorld,
  said: { from?: string; to?: string; page?: number },
): Promise<void> => {
  await world.browserPage.goto(addressOf(world, said));
};

Given("the tournaments are open", async function (this: SpecWorld) {
  await open(this, {});
});

When("the tournaments are opened", async function (this: SpecWorld) {
  await open(this, {});
});

Given(
  "the tournaments from {string} to {string} are open",
  async function (this: SpecWorld, from: string, to: string) {
    await open(this, { from, to });
  },
);

When(
  "the tournaments from {string} to {string} are opened",
  async function (this: SpecWorld, from: string, to: string) {
    await open(this, { from, to });
  },
);

Given(
  "the tournaments from {string} to {string} are open at page {int}",
  async function (this: SpecWorld, from: string, to: string, page: number) {
    await open(this, { from, to, page });
  },
);

When(
  "the tournaments from {string} to {string} are opened at page {int}",
  async function (this: SpecWorld, from: string, to: string, page: number) {
    await open(this, { from, to, page });
  },
);

When(
  "the tournaments are opened from {string} only",
  async function (this: SpecWorld, from: string) {
    await open(this, { from });
  },
);

When(
  "the tournaments are opened to {string} only",
  async function (this: SpecWorld, to: string) {
    await open(this, { to });
  },
);

// The days are chosen in the filter's own fields, whatever language their
// labels are in.
Given(
  /^"(.*)" is chosen as (From|To)$/,
  async function (this: SpecWorld, day: string, field: string) {
    await this.browserPage
      .locator(`form.tournament-filter input[name="${field.toLowerCase()}"]`)
      .fill(day);
  },
);

Then(
  /^"(.*)" is (From|To)$/,
  async function (this: SpecWorld, day: string, field: string) {
    assert.equal(
      await this.browserPage
        .locator(`form.tournament-filter input[name="${field.toLowerCase()}"]`)
        .inputValue(),
      day,
    );
  },
);

Then(
  /^"(.*)" is the country chosen$/,
  async function (this: SpecWorld, country: string) {
    const chosen = this.browserPage.locator(
      'form.tournament-filter select[name="country"] option:checked',
    );
    assert.equal(await chosen.textContent(), country);
  },
);

Then(
  /^(\d+) of the days' tournaments (?:is|are) listed$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await rows(this, "days' tournaments").count(), Number(count));
  },
);

// Said by the page in the reader's language, so the words are the scenario's.
Then(
  "the page is said to be {string}",
  async function (this: SpecWorld, words: string) {
    assert.equal(
      (
        await this.browserPage
          .locator(".tournament-pages .tournament-page")
          .textContent()
      )?.trim(),
      words,
    );
  },
);

Then("no page is said", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator(".tournament-pages").count(), 0);
});

Then(
  /^the way to turn to the (previous|next) page is (not )?offered$/,
  async function (this: SpecWorld, which: string, not: string | undefined) {
    assert.equal(
      await this.browserPage
        .locator(
          `.tournament-pages a[rel="${which === "previous" ? "prev" : "next"}"]`,
        )
        .count(),
      not ? 0 : 1,
    );
  },
);
