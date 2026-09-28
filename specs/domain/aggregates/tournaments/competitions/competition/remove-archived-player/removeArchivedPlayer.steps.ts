import { Given, When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../../../support/world.js";
import {
  ask,
  byOf,
  happened,
  now,
  toldOf,
  tournamentPlayerNamed,
} from "../aCompetition.js";

When(
  "the archived tournament player {string} is removed",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.removeArchivedPlayer(
        tournamentPlayerNamed(this, name),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the archived tournament player {string} was removed from it",
  function (this: SpecWorld, name: string) {
    happened(this, (competition) => {
      competition.removeArchivedPlayer(
        tournamentPlayerNamed(this, name),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);
