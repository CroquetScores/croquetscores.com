import { Given } from "@cucumber/cucumber";

import type { SpecWorld } from "../../support/world.js";
import {
  aCompetition,
  competitionWritten,
  startWriting,
} from "../importingTournaments.js";

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

Given(
  "the Swiss counts the games of {string} as its own",
  function (this: SpecWorld, id: string) {
    const swiss = competitionWritten(this);
    swiss.CarryForwardCompetitions = [
      ...(swiss.CarryForwardCompetitions ?? []),
      { Id: id },
    ];
  },
);
