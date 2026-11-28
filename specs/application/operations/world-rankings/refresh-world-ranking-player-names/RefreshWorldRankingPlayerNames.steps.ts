// Refreshing the names of a sport's players
// (RefreshWorldRankingPlayerNames.feature), through the application's
// accounts and a fake of the rankings' site, both stood up by support of their
// own. The steps that say what the fake holds, what was kept and what was
// logged are the import's (ImportWorldRankingPlayers.steps.ts and
// worldRankings.ts), which the two features are held to together.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RefreshWorldRankingPlayerNames } from "../../../../../src/application/operations/world-rankings/RefreshWorldRankingPlayerNames.js";
import type { WorldRankingSport } from "../../../../../src/application/services/WorldRankingLists.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  keepingWhatCameOf,
  momentOf,
  registeringOf,
} from "../../accounts/roleRequests.js";

const refreshAt = async (
  world: SpecWorld,
  sport: WorldRankingSport,
  at: ReadOnlyDate,
): Promise<void> => {
  await keepingWhatCameOf(world, () =>
    registeringOf(world).refreshWorldRankingPlayerNames(
      new RefreshWorldRankingPlayerNames(at, "croquetscores.com", sport),
    ),
  );
};

const SPORT = "(association croquet|golf croquet)";
const sportCalled = (name: string): WorldRankingSport =>
  name === "golf croquet" ? "gc" : "ac";

When(
  new RegExp(`^the ${SPORT} names are refreshed$`),
  async function (this: SpecWorld, sport: string) {
    await refreshAt(this, sportCalled(sport), momentOf(this));
  },
);

When(
  new RegExp(`^the ${SPORT} names are refreshed at "([^"]*)"$`),
  async function (this: SpecWorld, sport: string, moment: string) {
    await refreshAt(
      this,
      sportCalled(sport),
      ReadOnlyDate.from(new Date(moment)),
    );
  },
);

Then("the refresh failed", function (this: SpecWorld) {
  assert.ok(this.failure !== undefined, "The refresh did not fail.");
});
