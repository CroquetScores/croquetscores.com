import { When } from "@cucumber/cucumber";

import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, byOf, now } from "../aTournament.js";

// A team or a player the tournament does not have is asked for by an id of
// nobody's, so that the tournament is the one to refuse it.
When(
  "the world ranking name of the player {string} of the team {string} is changed to {string}",
  function (
    this: SpecWorld,
    name: string,
    team: string,
    worldRankingName: string,
  ) {
    ask(this, (tournament) => {
      const found = tournament.teams.find(
        (each) => each.name.toString() === team,
      );
      tournament.changeTeamPlayerWorldRankingName(
        found?.id ?? TeamId.create(),
        found?.players.find((each) => each.name.toString() === name)?.id ??
          TeamPlayerId.create(),
        worldRankingName,
        byOf(this),
        now(this),
      );
    });
  },
);
