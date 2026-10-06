import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../../support/world.js";
import { ask, byOf } from "../aTournament.js";

// Asked of the tournament as whatever writes a note asks it, before the note
// is added, edited or deleted.
When("the tournament's manager notes are written", function (this: SpecWorld) {
  ask(this, (tournament) => {
    tournament.allowWritingManagerNotes(byOf(this));
  });
});
