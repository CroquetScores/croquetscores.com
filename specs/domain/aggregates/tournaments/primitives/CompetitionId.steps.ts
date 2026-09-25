import { Given } from "@cucumber/cucumber";

import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a competition id is, said once. Every other step is the one every kind
// of id shares.
Given("the competition kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => CompetitionId.create(),
    read: (written) => CompetitionId.from(written),
  };
});
