import { Given } from "@cucumber/cucumber";

import { TeamPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a team player id is, said once. Every other step is the one every kind
// of id shares.
Given("the team player kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => TeamPlayerId.create(),
    read: (written) => TeamPlayerId.from(written),
  };
});
