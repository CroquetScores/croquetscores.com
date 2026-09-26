import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type Games,
  noGamesYet,
} from "../../../../src/application/services/Games.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { SpecWorld } from "../../../support/world.js";

const gamesOf = (world: SpecWorld): Games => {
  assert.ok(world.games !== undefined, "There are no games to ask.");
  return world.games;
};

// The tournament a question is about, which none of the questions here turns
// on: nothing has been played in any.
const A_TOURNAMENT = TournamentId.create();

Given("the application's games", function (this: SpecWorld) {
  this.games = noGamesYet;
});

When(
  "they are asked whether the player {string} has played any games",
  async function (this: SpecWorld, player: string) {
    this.answer = await gamesOf(this).hasPlayed(
      A_TOURNAMENT,
      TournamentPlayerId.from(player),
    );
  },
);

When(
  "they are asked whether the competition {string} has any games",
  async function (this: SpecWorld, competition: string) {
    this.answer = await gamesOf(this).hasGames(
      A_TOURNAMENT,
      CompetitionId.from(competition),
    );
  },
);

When(
  "they are asked whether changing the draw of the knockout {string} to {int} places moves a player who has played",
  async function (this: SpecWorld, competition: string, places: number) {
    this.answer = await gamesOf(this).movesAPlayerWhoHasPlayed(
      A_TOURNAMENT,
      CompetitionId.from(competition),
      KnockoutDraw.from(
        places,
        Array.from({ length: Math.log2(places) }, () => 1),
      ),
    );
  },
);

Then("they say no", function (this: SpecWorld) {
  assert.equal(this.answer, false);
});
