import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  TournamentsInDays,
  type TournamentsPage,
  type TournamentsSorting,
} from "../../../../../src/application/operations/tournaments/TournamentsInDays.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// Asked with nobody signed in. The tournaments answered are said in the words
// every list of a website's tournaments shares (tournamentsOfWebsite.steps.ts).
const ask = async (
  world: SpecWorld,
  first: string | undefined,
  last: string | undefined,
  page: number,
  sorting?: { column: string; order: string },
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new TournamentsInDays(
        "croquetscores.com",
        first,
        last,
        page,
        world.filterChosen,
        sorting as TournamentsSorting | undefined,
        languages.get(world),
      ),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

// The language names are ordered in, where a scenario says; the question's own
// where it does not.
const languages = new WeakMap<SpecWorld, string>();

Given(
  "the reader reads the language {string}",
  function (this: SpecWorld, tag: string) {
    languages.set(this, tag);
  },
);

When(
  /^the tournaments from "(.*)" to "(.*)" are asked for, sorted by (\w+) from the (smallest|largest)(?:, page (\d+))?$/,
  async function (
    this: SpecWorld,
    first: string,
    last: string,
    column: string,
    way: string,
    page: string | undefined,
  ) {
    await ask(this, first, last, page ? Number(page) : 1, {
      column,
      order: way === "smallest" ? "up" : "down",
    });
  },
);

When("the tournaments are asked for", async function (this: SpecWorld) {
  await ask(this, undefined, undefined, 1);
});

When(
  "the tournaments are asked for from {string} only",
  async function (this: SpecWorld, first: string) {
    await ask(this, first, undefined, 1);
  },
);

When(
  "the tournaments from {string} to {string} are asked for",
  async function (this: SpecWorld, first: string, last: string) {
    await ask(this, first, last, 1);
  },
);

When(
  "the tournaments from {string} to {string} are asked for, page {float}",
  async function (this: SpecWorld, first: string, last: string, page: number) {
    await ask(this, first, last, page);
  },
);

const pageAnswered = (world: SpecWorld): TournamentsPage => {
  const answer = world.answer as TournamentsPage | undefined;
  assert.ok(
    answer !== undefined && "lastPage" in answer,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return answer;
};

Then(
  "the number of tournaments in all is {int}",
  function (this: SpecWorld, total: number) {
    assert.equal(pageAnswered(this).total, total);
  },
);

Then("the last page is {int}", function (this: SpecWorld, page: number) {
  assert.equal(pageAnswered(this).lastPage, page);
});
