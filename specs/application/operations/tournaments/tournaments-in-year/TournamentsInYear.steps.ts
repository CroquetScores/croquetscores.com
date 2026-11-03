import { When } from "@cucumber/cucumber";

import { TournamentsInYear } from "../../../../../src/application/operations/tournaments/TournamentsInYear.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// Asked with nobody signed in, with the filter the scenario chose. What was
// answered is said in the words every list of a website's tournaments shares
// (tournamentsOfWebsite.steps.ts).
const ask = async (
  world: SpecWorld,
  website: string,
  year: number,
  month?: number,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new TournamentsInYear(website, year, world.filterChosen, month),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the tournaments in {int} are asked for",
  async function (this: SpecWorld, year: number) {
    await ask(this, "croquetscores.com", year);
  },
);

When(
  "the tournaments on {string} in {int} are asked for",
  async function (this: SpecWorld, website: string, year: number) {
    await ask(this, website, year);
  },
);

// Any number is a month for this step, so that one there is not can be asked
// for and refused.
When(
  "the tournaments in month {float} of {int} are asked for",
  async function (this: SpecWorld, month: number, year: number) {
    await ask(this, "croquetscores.com", year, month);
  },
);
