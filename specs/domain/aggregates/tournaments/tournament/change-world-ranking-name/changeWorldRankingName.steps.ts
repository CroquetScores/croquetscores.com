import { When } from "@cucumber/cucumber";

import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, byOf, now } from "../aTournament.js";

// A player the tournament does not have is asked for by an id of nobody's, so
// that the tournament is the one to refuse it.
When(
  "the world ranking name of the player {string} is changed to {string}",
  function (this: SpecWorld, name: string, worldRankingName: string) {
    ask(this, (tournament) =>
      tournament.changeWorldRankingName(
        tournament.players.find((each) => each.name.toString() === name)?.id ??
          TournamentPlayerId.create(),
        worldRankingName,
        byOf(this),
        now(this),
      ),
    );
  },
);
