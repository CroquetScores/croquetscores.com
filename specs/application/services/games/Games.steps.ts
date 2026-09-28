import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { SpecWorld } from "../../../support/world.js";
import { playerNamed } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  inHandOf,
  load,
  tournamentNamed,
} from "../../operations/tournaments/aRequest.js";
import { competitionIn } from "../../operations/tournaments/requests.js";

// The application's games, asked as its operations ask them, about what the
// scenario has done through the application.

When(
  "the games are asked whether the player {string} of {string} has played",
  async function (this: SpecWorld, player: string, name: string) {
    const tournament = tournamentNamed(this, name);
    const found = playerNamed(await load(this, tournament), player);
    this.answer = await this.asARequest(() =>
      inHandOf(this).games.hasPlayed(tournament, found.id),
    );
  },
);

When(
  "the games are asked whether changing the draw of {string} of {string} to {int} places moves a player who has played",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    places: number,
  ) {
    const tournament = tournamentNamed(this, name);
    const id = await competitionIn(this, tournament, competition);
    this.answer = await this.asARequest(() =>
      inHandOf(this).games.movesAPlayerWhoHasPlayed(
        tournament,
        id,
        KnockoutDraw.from(
          places,
          Array.from({ length: Math.log2(places) }, () => 1),
        ),
      ),
    );
  },
);

Then("they say yes", function (this: SpecWorld) {
  assert.equal(this.answer, true);
});

Then("they say no", function (this: SpecWorld) {
  assert.equal(this.answer, false);
});
