import { Given } from "@cucumber/cucumber";

import { TournamentPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a tournament player id is, said once. Every other step is the one every
// kind of id shares.
Given("the tournament player kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => TournamentPlayerId.create(),
    read: (written) => TournamentPlayerId.from(written),
  };
});
