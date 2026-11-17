// What the rounds of a knockout added before the scenario are to be, said to
// the in-process specs that add one (the website's own are said to the site,
// in specs/web/support/competitions.ts).
import { Given } from "@cucumber/cucumber";

import { scenarioOf as domainScenarioOf } from "../../domain/aggregates/tournaments/tournament/aTournament.js";
import type { SpecWorld } from "../../support/world.js";

Given(
  /^the knockout's (first|second) round is to be the best of (\d+)$/,
  function (this: SpecWorld, round: string, games: string) {
    domainScenarioOf(this).drawRounds[round === "first" ? 0 : 1] =
      Number(games);
  },
);
