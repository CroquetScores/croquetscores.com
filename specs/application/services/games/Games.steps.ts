import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  teamNamed,
  teamPlayerNamed,
  testNamed,
} from "../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
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

When(
  "the games are asked whether making the final of {string} of {string} the best of {int} moves a player who has played",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    games: number,
  ) {
    const tournament = tournamentNamed(this, name);
    const id = await competitionIn(this, tournament, competition);
    // A knockout as the scenarios add it: four places, each round the best of
    // 1. Only its last round, the final, is given another best-of.
    this.answer = await this.asARequest(() =>
      inHandOf(this).games.movesAPlayerWhoHasPlayed(
        tournament,
        id,
        KnockoutDraw.from(4, [1, games]),
      ),
    );
  },
);

When(
  "the games are asked whether the player {string} of the team {string} of {string} has played",
  async function (this: SpecWorld, player: string, team: string, name: string) {
    const tournament = tournamentNamed(this, name);
    const found = teamPlayerNamed(
      teamNamed(await load(this, tournament), team),
      player,
    );
    this.answer = await this.asARequest(() =>
      inHandOf(this).games.teamPlayerHasPlayed(tournament, found.id),
    );
  },
);

// What has been played in the test `test` of the tournament `name`.
const playedIn = async (world: SpecWorld, test: string, name: string) => {
  const tournament = tournamentNamed(world, name);
  const { reference } = testNamed(await load(world, tournament), test);
  return world.asARequest(() =>
    inHandOf(world).games.playedIn(tournament, reference.id),
  );
};

// A test has games where it has a match started, since a match is started by
// a game in use between its two players.
When(
  "the games are asked whether {string} of {string} has any games",
  async function (this: SpecWorld, test: string, name: string) {
    this.answer = (await playedIn(this, test, name)).matchesStarted > 0;
  },
);

When(
  "the games are asked how many matches of {string} of {string} have started",
  async function (this: SpecWorld, test: string, name: string) {
    this.answer = (await playedIn(this, test, name)).matchesStarted;
  },
);

When(
  "the games are asked the most games two players have played in {string} of {string}",
  async function (this: SpecWorld, test: string, name: string) {
    this.answer = (await playedIn(this, test, name)).mostGamesBetweenTwo;
  },
);

Then("they say {int}", function (this: SpecWorld, count: number) {
  assert.equal(this.answer, count);
});

Then("they say yes", function (this: SpecWorld) {
  assert.equal(this.answer, true);
});

Then("they say no", function (this: SpecWorld) {
  assert.equal(this.answer, false);
});
