import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../../support/world.js";
import { ask } from "../aTournament.js";

// Asked of the tournament as whatever writes commentary asks it, before the
// commentary is started or written in.
When("commentary is written on the tournament", function (this: SpecWorld) {
  ask(this, (tournament) => {
    tournament.allowWritingCommentary();
  });
});
