import { When } from "@cucumber/cucumber";

import { RecentResults } from "../../../../../src/application/operations/tournaments/RecentResults.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// Asked with nobody signed in, with the filter the scenario chose. What was
// answered is said in the words both lists' features share
// (tournamentsOfWebsite.steps.ts).
const ask = async (
  world: SpecWorld,
  website: string,
  moment: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new RecentResults(
        website,
        ReadOnlyDate.from(new Date(moment)),
        world.filterChosen,
      ),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the recent results are asked for at {string}",
  async function (this: SpecWorld, moment: string) {
    await ask(this, "croquetscores.com", moment);
  },
);

When(
  "the recent results on {string} are asked for at {string}",
  async function (this: SpecWorld, website: string, moment: string) {
    await ask(this, website, moment);
  },
);
