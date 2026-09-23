import { Given } from "@cucumber/cucumber";

import { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a tournament id is, said once. Every other step is the one every kind
// of id shares.
Given("the tournament kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => TournamentId.create(),
    read: (written) => TournamentId.from(written),
  };
});
