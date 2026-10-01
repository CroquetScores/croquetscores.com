import { Given } from "@cucumber/cucumber";

import { TeamId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a team id is, said once. Every other step is the one every kind of id
// shares.
Given("the team kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => TeamId.create(),
    read: (written) => TeamId.from(written),
  };
});
