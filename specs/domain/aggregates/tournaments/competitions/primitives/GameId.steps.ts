import { Given } from "@cucumber/cucumber";

import { GameId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a game id is, said once. Every other step is the one every kind of id
// shares.
Given("the game kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => GameId.create(),
    read: (written) => GameId.from(written),
  };
});
