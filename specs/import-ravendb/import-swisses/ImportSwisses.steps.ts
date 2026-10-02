import { Given } from "@cucumber/cucumber";

import type { SpecWorld } from "../../support/world.js";
import { aCompetition, startWriting } from "../importingTournaments.js";

Given(
  "the Swiss {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "swiss",
      website,
      id,
      document: aCompetition("swiss", tournament),
    });
  },
);
