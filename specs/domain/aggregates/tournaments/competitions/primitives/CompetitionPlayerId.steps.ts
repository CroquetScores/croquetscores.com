import { Given } from "@cucumber/cucumber";

import { CompetitionPlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a competition player id is, said once. Every other step is the one
// every kind of id shares.
Given("the competition player kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => CompetitionPlayerId.create(),
    read: (written) => CompetitionPlayerId.from(written),
  };
});
