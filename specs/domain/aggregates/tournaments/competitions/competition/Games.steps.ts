import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Competition } from "../../../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import { CompetitionGameAdded } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameArchived.js";
import { CompetitionGameCorrected } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameCorrected.js";
import { CompetitionGameMoved } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameMoved.js";
import { CompetitionGameRestored } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameRestored.js";
import type {
  Game,
  GamePlayerId,
} from "../../../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionPlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { GameId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { KnockoutDraw } from "../../../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Website } from "../../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  competitionOf,
  gamePlayerNamed,
  happened,
  isATest,
  now,
  scenarioOf,
  teamPlayerNamed,
  toldOf,
  tournamentPlayerNamed,
} from "./aCompetition.js";

// The steps a competition's games' features share: what kind of competition it
// is, the games added, archived and restored, and what the competition has
// afterwards. A game is named as the result is said aloud, "Sam Someone
// beating Alex Another 26 to 17", its scores as they were typed, on Croquet
// Scores.

// What the competition is told it is -------------------------------------------

Given(
  "the competition is a block, each match the best of {int}",
  function (this: SpecWorld, games: number) {
    const scenario = scenarioOf(this);
    scenario.told = {
      ...scenario.told,
      shape: { kind: "block", bestOf: BestOf.from(games) },
    };
  },
);

Given("the competition is a Swiss", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  scenario.told = {
    ...scenario.told,
    shape: { kind: "swiss", bestOf: BestOf.from(1) },
  };
});

const knockout = (world: SpecWorld, places: number, rounds: number[]) => {
  const scenario = scenarioOf(world);
  scenario.told = {
    ...scenario.told,
    shape: { kind: "knockout", draw: KnockoutDraw.from(places, rounds) },
  };
};

Given(
  "the competition is a knockout of {int} places, each round the best of {int}",
  function (this: SpecWorld, places: number, games: number) {
    knockout(
      this,
      places,
      Array.from({ length: Math.log2(places) }, () => games),
    );
  },
);

Given(
  "the competition is a knockout of {int} places, its first round the best of {int} and its second the best of {int}",
  function (this: SpecWorld, places: number, first: number, second: number) {
    knockout(this, places, [first, second]);
  },
);

// The games ------------------------------------------------------------------

// The id the scenario gives the games it adds, where it gives one, so that a
// game added after it is given the same.
const givenIds = new WeakMap<SpecWorld, GameId>();

Given("the game id {string}", function (this: SpecWorld, written: string) {
  givenIds.set(this, GameId.from(written));
});

const nextId = (world: SpecWorld): GameId =>
  givenIds.get(world) ?? GameId.create();

// The competition's player who is the tournament player called `name`, or an
// id that names nobody where it has none, for a game with a player it does
// not have. In a test, which has no players entered, the player of a team
// called `name`.
const playerIn = (
  world: SpecWorld,
  competition: Competition,
  name: string,
): GamePlayerId =>
  isATest(world)
    ? teamPlayerNamed(world, name)
    : (competition.players.find((player) =>
        player.tournamentPlayerId.equals(tournamentPlayerNamed(world, name)),
      )?.id ?? CompetitionPlayerId.create());

const GAME = String.raw`the game of "([^"]*)" beating "([^"]*)" (\S+) to (\S+)`;

const add = (
  world: SpecWorld,
  competition: Competition,
  [winner, loser, winnerScore, loserScore]: string[],
): void => {
  competition.addGame(
    nextId(world),
    {
      winner: playerIn(world, competition, winner ?? ""),
      winnerScore: Score.read(winnerScore ?? "", Website.croquetScores),
      loser: playerIn(world, competition, loser ?? ""),
      loserScore: Score.read(loserScore ?? "", Website.croquetScores),
    },
    toldOf(world),
    byOf(world),
    now(world),
  );
};

// The game said, as the competition has it.
const gameSaid = (
  world: SpecWorld,
  competition: Competition,
  [winner, loser, winnerScore, loserScore]: (string | undefined)[],
): Game => {
  const found = competition.games.find(
    (game) =>
      game.winner.equals(gamePlayerNamed(world, competition, winner ?? "")) &&
      game.loser.equals(gamePlayerNamed(world, competition, loser ?? "")) &&
      (winnerScore === undefined || String(game.winnerScore) === winnerScore) &&
      (loserScore === undefined || String(game.loserScore) === loserScore),
  );
  assert.ok(
    found !== undefined,
    `The competition has no game of ${String(winner)} beating ${String(loser)}.`,
  );
  return found;
};

When(
  new RegExp(`^${GAME} is added$`),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    ask(this, (competition) => {
      add(this, competition, said);
    });
  },
);

// A bye is nobody, but has an id, which a game can be sent with.
When(
  /^the game of "([^"]*)" beating a bye (\S+) to (\S+) is added$/,
  function (
    this: SpecWorld,
    winner: string,
    winnerScore: string,
    loserScore: string,
  ) {
    ask(this, (competition) => {
      competition.addGame(
        nextId(this),
        {
          winner: playerIn(this, competition, winner),
          winnerScore: Score.read(winnerScore, Website.croquetScores),
          loser: CompetitionPlayerId.bye(),
          loserScore: Score.read(loserScore, Website.croquetScores),
        },
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  new RegExp(`^${GAME} was added to it$`),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    happened(this, (competition) => {
      add(this, competition, said);
    });
  },
);

// Corrected to scores as they were typed, on Croquet Scores, and to the
// players named where there are any.
const correct = (
  world: SpecWorld,
  competition: Competition,
  id: GameId,
  winnerScore: string,
  loserScore: string,
  players?: { readonly winner: string; readonly loser: string },
): void => {
  competition.correctGame(
    id,
    Score.read(winnerScore, Website.croquetScores),
    Score.read(loserScore, Website.croquetScores),
    toldOf(world),
    byOf(world),
    now(world),
    players === undefined
      ? undefined
      : {
          winner: playerIn(world, competition, players.winner),
          loser: playerIn(world, competition, players.loser),
        },
  );
};

// The same, to other players: the game said, and what it is corrected to.
const OTHER_PLAYERS = String.raw`"([^"]*)" beating "([^"]*)" (\S+) to (\S+)`;

for (const [step, doing] of [
  [When, "is"],
  [Given, "was"],
] as const) {
  step(
    new RegExp(String.raw`^${GAME} ${doing} corrected to ${OTHER_PLAYERS}$`),
    function (
      this: SpecWorld,
      winner: string,
      loser: string,
      winnerScore: string,
      loserScore: string,
      correctedWinner: string,
      correctedLoser: string,
      correctedWinnerScore: string,
      correctedLoserScore: string,
    ) {
      const said = [winner, loser, winnerScore, loserScore];
      (doing === "is" ? ask : happened)(this, (competition) => {
        correct(
          this,
          competition,
          gameSaid(this, competition, said).id,
          correctedWinnerScore,
          correctedLoserScore,
          { winner: correctedWinner, loser: correctedLoser },
        );
      });
    },
  );
}

When(
  new RegExp(String.raw`^${GAME} is corrected to (\S+) to (\S+)$`),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    correctedWinnerScore: string,
    correctedLoserScore: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    ask(this, (competition) => {
      correct(
        this,
        competition,
        gameSaid(this, competition, said).id,
        correctedWinnerScore,
        correctedLoserScore,
      );
    });
  },
);

Given(
  new RegExp(String.raw`^${GAME} was corrected to (\S+) to (\S+)$`),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    correctedWinnerScore: string,
    correctedLoserScore: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    happened(this, (competition) => {
      correct(
        this,
        competition,
        gameSaid(this, competition, said).id,
        correctedWinnerScore,
        correctedLoserScore,
      );
    });
  },
);

When(
  /^the game "([^"]*)" is corrected to (\S+) to (\S+) by its id$/,
  function (
    this: SpecWorld,
    id: string,
    winnerScore: string,
    loserScore: string,
  ) {
    ask(this, (competition) => {
      correct(this, competition, GameId.from(id), winnerScore, loserScore);
    });
  },
);

for (const [verb, doing] of [
  ["archived", "archiveGame"],
  ["restored", "restoreGame"],
] as const) {
  When(
    new RegExp(`^${GAME} is ${verb}$`),
    function (
      this: SpecWorld,
      winner: string,
      loser: string,
      winnerScore: string,
      loserScore: string,
    ) {
      const said = [winner, loser, winnerScore, loserScore];
      ask(this, (competition) => {
        competition[doing](
          gameSaid(this, competition, said).id,
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );

  Given(
    new RegExp(`^${GAME} was ${verb}$`),
    function (
      this: SpecWorld,
      winner: string,
      loser: string,
      winnerScore: string,
      loserScore: string,
    ) {
      const said = [winner, loser, winnerScore, loserScore];
      happened(this, (competition) => {
        competition[doing](
          gameSaid(this, competition, said).id,
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );

  When(
    `the game {string} is ${verb} by its id`,
    function (this: SpecWorld, id: string) {
      ask(this, (competition) => {
        competition[doing](
          GameId.from(id),
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );
}

// A test's game moved a place, up or down.
for (const direction of ["up", "down"] as const) {
  When(
    new RegExp(`^${GAME} is moved ${direction}$`),
    function (
      this: SpecWorld,
      winner: string,
      loser: string,
      winnerScore: string,
      loserScore: string,
    ) {
      const said = [winner, loser, winnerScore, loserScore];
      ask(this, (competition) => {
        competition.moveGame(
          gameSaid(this, competition, said).id,
          direction,
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );

  Given(
    new RegExp(`^${GAME} was moved ${direction}$`),
    function (
      this: SpecWorld,
      winner: string,
      loser: string,
      winnerScore: string,
      loserScore: string,
    ) {
      const said = [winner, loser, winnerScore, loserScore];
      happened(this, (competition) => {
        competition.moveGame(
          gameSaid(this, competition, said).id,
          direction,
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );

  When(
    `the game {string} is moved ${direction} by its id`,
    function (this: SpecWorld, id: string) {
      ask(this, (competition) => {
        competition.moveGame(
          GameId.from(id),
          direction,
          toldOf(this),
          byOf(this),
          now(this),
        );
      });
    },
  );
}

Then(
  "the first thing it recorded is a game being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionGameMoved);
  },
);

// What the competition has afterwards -----------------------------------------

Then(
  new RegExp(`^the competition has ${GAME}$`),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    gameSaid(this, competitionOf(this), said);
  },
);

Then(
  /^the competition has (\d+) games?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(competitionOf(this).games.length, Number(count));
  },
);

Then(
  /^the competition's first game is of "([^"]*)" beating "([^"]*)"$/,
  function (this: SpecWorld, winner: string, loser: string) {
    const competition = competitionOf(this);
    const [first] = competition.games;
    assert.ok(first !== undefined, "The competition has no games.");
    assert.ok(
      first.equals(gameSaid(this, competition, [winner, loser])),
      "The first game is another.",
    );
  },
);

Then(
  new RegExp(
    `^the competition's ${GAME.replace("the game", "game")} is known by "([^"]*)"$`,
  ),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    written: string,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    assert.equal(gameSaid(this, competitionOf(this), said).id.value, written);
  },
);

Then(
  new RegExp(
    `^the competition's ${GAME.replace("the game", "game")} is (not )?archived$`,
  ),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    not: string | null,
  ) {
    const said = [winner, loser, winnerScore, loserScore];
    assert.equal(
      gameSaid(this, competitionOf(this), said).archived,
      not === null,
    );
  },
);

for (const [happening, kind] of [
  ["a game being added", CompetitionGameAdded],
  ["a game being archived", CompetitionGameArchived],
  ["a game being restored", CompetitionGameRestored],
  ["a game being corrected", CompetitionGameCorrected],
] as const) {
  Then(
    `the first thing it recorded is ${happening}`,
    function (this: SpecWorld) {
      assertRecordedAt(this, 0, kind);
    },
  );
}
