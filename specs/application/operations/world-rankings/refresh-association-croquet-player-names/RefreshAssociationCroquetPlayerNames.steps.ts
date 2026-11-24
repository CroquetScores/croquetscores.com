// Refreshing the association croquet names
// (RefreshAssociationCroquetPlayerNames.feature), through the application's
// accounts and a fake of the rankings' site, both stood up by support of their
// own. The steps that say what the fake holds, what was kept and what was
// logged are the import's (ImportWorldRankingPlayers.steps.ts and
// worldRankings.ts), which the two features are held to together.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RefreshAssociationCroquetPlayerNames } from "../../../../../src/application/operations/world-rankings/RefreshAssociationCroquetPlayerNames.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  keepingWhatCameOf,
  momentOf,
  registeringOf,
} from "../../accounts/roleRequests.js";

const refreshAt = async (world: SpecWorld, at: ReadOnlyDate): Promise<void> => {
  await keepingWhatCameOf(world, () =>
    registeringOf(world).refreshAssociationCroquetPlayerNames(
      new RefreshAssociationCroquetPlayerNames(at, "croquetscores.com"),
    ),
  );
};

When(
  "the association croquet names are refreshed",
  async function (this: SpecWorld) {
    await refreshAt(this, momentOf(this));
  },
);

When(
  "the association croquet names are refreshed at {string}",
  async function (this: SpecWorld, moment: string) {
    await refreshAt(this, ReadOnlyDate.from(new Date(moment)));
  },
);

Then("the refresh failed", function (this: SpecWorld) {
  assert.ok(this.failure !== undefined, "The refresh did not fail.");
});
