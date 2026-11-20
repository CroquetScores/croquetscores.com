import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { toldOf } from "../../../../src/application/operations/competitions/competitionOperations.js";
import type { GamesKept } from "../../../../src/application/operations/tournaments/competitionGames.js";
import { gamesToTell } from "../../../../src/application/operations/tournaments/gamesToTell.js";
import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import {
  Competition,
  type Told,
} from "../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { GamePlayerId } from "../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionPlayerId } from "../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { GameId } from "../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { ExpectedMatches } from "../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { CompetitionGames } from "../../../../src/infrastructure/read-models/CompetitionGames.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  scenarioOf,
  standUp,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a tournament is, what is done to it and what is found of it are said in
// the words every read model of tournaments shares
// (specs/infrastructure/support/tournamentReadModels.ts). What is here is its
// competitions, their players and their games, and what is asked of them.

interface Scenario {
  // Each thing by its name and where it is, written "Block A of Spring Open",
  // "Sam Someone in Block A of Spring Open" and "the first in Block A of
  // Spring Open", so that two competitions can each have one.
  readonly competitions: Map<string, CompetitionId>;
  readonly players: Map<string, TournamentPlayerId>;
  readonly entries: Map<string, GamePlayerId>;
  readonly games: Map<string, GameId>;
  // How many players have been made, so that none is called as another is.
  kept: GamesKept | undefined;
  kind: "block" | "swiss" | "knockout" | "test";
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

// Shared with the steps for the standings of the same competitions
// (CompetitionStandings.steps.ts), which are made with this file's words.
export const ownScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      competitions: new Map(),
      players: new Map(),
      entries: new Map(),
      games: new Map(),
      kept: undefined,
      kind: "block",
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

export const found = <T>(map: Map<string, T>, key: string): T => {
  const one = map.get(key);
  assert.ok(one !== undefined, `Nothing was made called ${key}.`);
  return one;
};

const readModelOf = (world: SpecWorld): CompetitionGames => {
  const { readModel } = scenarioOf(world);
  assert.ok(readModel instanceof CompetitionGames);
  return readModel;
};

Given("the competition games read model", function (this: SpecWorld) {
  standUp(this, new CompetitionGames(unitOfWorkOf(this)), {
    country: "au",
    region: "vic",
  });
});

// Its competitions and their players -----------------------------------------------------

Given(
  /^an? (block|knockout) named "([^"]*)"( that allows drawn results)? is made in "([^"]*)"$/,
  async function (
    this: SpecWorld,
    kind: string,
    name: string,
    draws: string | undefined,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      const called = CompetitionName.from(name);
      if (kind === "block") {
        each.addBlock(
          id,
          called,
          BestOf.from(1),
          Rounds.from(1),
          by,
          at,
          draws === undefined ? {} : { drawsAllowed: true },
        );
      } else {
        each.addKnockout(id, called, KnockoutDraw.from(4, [1, 1]), by, at);
      }
    });
  },
);

Given(
  "the player {string} is made in {string}",
  async function (this: SpecWorld, name: string, tournament: string) {
    const id = TournamentPlayerId.create();
    ownScenarioOf(this).players.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addPlayer(id, { name }, by, at);
    });
  },
);

// Done to the competition `competition` of `tournament` by whoever created the
// tournament, who manages it. It is told of itself when it asks rather than
// once beforehand, since what is done may change what it is told.
export const doneToCompetition = async (
  world: SpecWorld,
  competition: string,
  tournament: string,
  doing: (
    found: Competition,
    told: () => Told,
    by: AccountId,
    tournamentOf: Tournament,
  ) => void,
): Promise<void> => {
  const id = found(
    ownScenarioOf(world).competitions,
    `${competition} of ${tournament}`,
  );
  const { competitions } = scenarioOf(world);
  await doneTo(world, tournament, async (each, by) => {
    const kept =
      (await competitions.load(id)) ?? Competition.rebuiltFrom(id, []);
    doing(kept, () => toldOf(each, id), by, each);
    await competitions.save(kept);
  });
};

Given(
  "the player {string} is entered in {string} of {string}",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    const own = ownScenarioOf(this);
    const id = found(own.players, `${player} of ${tournament}`);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (each, told, by, tournamentOf) => {
        const order = tournamentOf.players.find((one) => one.id.equals(id));
        assert.ok(order !== undefined, `${player} is not in ${tournament}.`);
        own.entries.set(
          `${player} in ${competition} of ${tournament}`,
          each.enterPlayer(id, order.order, told(), by, at),
        );
      },
    );
  },
);

Given(
  "a bye is entered in {string} of {string}",
  async function (this: SpecWorld, competition: string, tournament: string) {
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      each.enterBye(told(), by, at);
    });
  },
);

export const entryOf = (
  world: SpecWorld,
  player: string,
  competition: string,
  tournament: string,
): CompetitionPlayerId => {
  const entry = found(
    ownScenarioOf(world).entries,
    `${player} in ${competition} of ${tournament}`,
  );
  assert.ok(entry instanceof CompetitionPlayerId);
  return entry;
};

Given(
  /^the player "([^"]*)" in "([^"]*)" of "([^"]*)" is (moved down|withdrawn|removed)$/,
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    const id = entryOf(this, player, competition, tournament);
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      if (what === "moved down") each.movePlayer(id, "down", told(), by, at);
      else if (what === "withdrawn") each.withdrawPlayer(id, told(), by, at);
      else each.removePlayer(id, told(), by, at);
    });
  },
);

Given(
  "the withdrawal of the player {string} in {string} of {string} is reversed",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    const id = entryOf(this, player, competition, tournament);
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      each.reverseWithdrawal(id, told(), by, at);
    });
  },
);

Given(
  /^the bye of "([^"]*)" of "([^"]*)" is (moved up|removed)$/,
  async function (
    this: SpecWorld,
    competition: string,
    tournament: string,
    what: string,
  ) {
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      const bye = each.players.find((one) => one.isBye);
      assert.ok(bye !== undefined, "There is no bye.");
      if (what === "moved up") each.moveBye(bye.order, "up", told(), by, at);
      else each.removeBye(bye.order, told(), by, at);
    });
  },
);

// Its games -----------------------------------------------------------------------------

const scoreOf = (tournament: Tournament, written: string): Score =>
  Score.read(written, tournament.website);

Given(
  /^"([^"]*)" beat "([^"]*)" (\S+) to (\S+) in "([^"]*)" of "([^"]*)" as "([^"]*)"$/,
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    tournament: string,
    label: string,
  ) {
    const own = ownScenarioOf(this);
    const game = GameId.create();
    own.games.set(`${label} in ${competition} of ${tournament}`, game);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (each, told, by, tournamentOf) => {
        each.addGame(
          game,
          {
            winner: found(
              own.entries,
              `${winner} in ${competition} of ${tournament}`,
            ),
            winnerScore: scoreOf(tournamentOf, winnerScore),
            loser: found(
              own.entries,
              `${loser} in ${competition} of ${tournament}`,
            ),
            loserScore: scoreOf(tournamentOf, loserScore),
          },
          told(),
          by,
          at,
        );
      },
    );
  },
);

const gameOf = (
  world: SpecWorld,
  label: string,
  competition: string,
  tournament: string,
): GameId =>
  found(
    ownScenarioOf(world).games,
    `${label} in ${competition} of ${tournament}`,
  );

Given(
  "the game {string} in {string} of {string} is corrected to {int} to {int}",
  async function (
    this: SpecWorld,
    label: string,
    competition: string,
    tournament: string,
    winnerScore: number,
    loserScore: number,
  ) {
    const id = gameOf(this, label, competition, tournament);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (each, told, by, tournamentOf) => {
        each.correctGame(
          id,
          scoreOf(tournamentOf, String(winnerScore)),
          scoreOf(tournamentOf, String(loserScore)),
          told(),
          by,
          at,
        );
      },
    );
  },
);

Given(
  /^the game "([^"]*)" in "([^"]*)" of "([^"]*)" is (archived|restored|withdrawn)$/,
  async function (
    this: SpecWorld,
    label: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    const id = gameOf(this, label, competition, tournament);
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      if (what === "archived") each.archiveGame(id, told(), by, at);
      else if (what === "restored") each.restoreGame(id, told(), by, at);
      else each.withdrawGame(id, told(), by, at);
    });
  },
);

Given(
  "the withdrawal of the game {string} in {string} of {string} is reversed",
  async function (
    this: SpecWorld,
    label: string,
    competition: string,
    tournament: string,
  ) {
    const id = gameOf(this, label, competition, tournament);
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      each.reverseGameWithdrawal(id, told(), by, at);
    });
  },
);

// A test and its games ------------------------------------------------------------------

Given(
  "a test between {string} and {string} is made in {string}",
  async function (
    this: SpecWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    const own = ownScenarioOf(this);
    const id = CompetitionId.create();
    own.competitions.set(`the test of ${tournament}`, id);
    own.kind = "test";
    await doneTo(this, tournament, (each, by) => {
      const teams = [first, second].map((name) => {
        const team = TeamId.create();
        each.addTeam(team, { name, shortName: name.slice(0, 3) }, by, at);
        return team;
      });
      each.addTest(
        id,
        {
          firstTeam: teams[0]!,
          secondTeam: teams[1]!,
          starts: each.starts,
          finishes: each.finishes,
          expectedMatches: ExpectedMatches.from(10),
          bestOf: BestOf.from(1),
        },
        by,
        at,
      );
    });
  },
);

Given(
  "the team players {string} and {string} play in the test of {string}",
  async function (
    this: SpecWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    const own = ownScenarioOf(this);
    await doneTo(this, tournament, (each, by) => {
      const [one, other] = each.teams;
      assert.ok(one !== undefined && other !== undefined, "No teams.");
      for (const [team, name] of [
        [one, first],
        [other, second],
      ] as const) {
        const id = TeamPlayerId.create();
        each.addTeamPlayer(team.id, id, { name }, by, at);
        own.entries.set(`${name} in the test of ${tournament}`, id);
      }
    });
  },
);

Given(
  /^"([^"]*)" beat "([^"]*)" (\S+) to (\S+) in the test of "([^"]*)" as "([^"]*)"$/,
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    tournament: string,
    label: string,
  ) {
    const own = ownScenarioOf(this);
    const game = GameId.create();
    own.games.set(`${label} in the test of ${tournament}`, game);
    const id = found(own.competitions, `the test of ${tournament}`);
    const { competitions } = scenarioOf(this);
    await doneTo(this, tournament, async (each, by) => {
      const kept =
        (await competitions.load(id)) ?? Competition.rebuiltFrom(id, []);
      kept.addGame(
        game,
        {
          winner: found(own.entries, `${winner} in the test of ${tournament}`),
          winnerScore: scoreOf(each, winnerScore),
          loser: found(own.entries, `${loser} in the test of ${tournament}`),
          loserScore: scoreOf(each, loserScore),
        },
        toldOf(each, id),
        by,
        at,
      );
      await competitions.save(kept);
    });
  },
);

Given(
  /^the game "([^"]*)" in the test of "([^"]*)" is moved (up|down)$/,
  async function (
    this: SpecWorld,
    label: string,
    tournament: string,
    direction: "up" | "down",
  ) {
    const own = ownScenarioOf(this);
    const game = found(own.games, `${label} in the test of ${tournament}`);
    const id = found(own.competitions, `the test of ${tournament}`);
    const { competitions } = scenarioOf(this);
    await doneTo(this, tournament, async (each, by) => {
      const kept =
        (await competitions.load(id)) ?? Competition.rebuiltFrom(id, []);
      kept.moveGame(game, direction, toldOf(each, id), by, at);
      await competitions.save(kept);
    });
  },
);

// What is read back ---------------------------------------------------------------------

const readBack = async (
  world: SpecWorld,
  competition: string,
): Promise<void> => {
  const id = found(ownScenarioOf(world).competitions, competition).value;
  await world.asARequest(async () => {
    ownScenarioOf(world).kept = await readModelOf(world).gamesKept(id);
  });
};

When(
  /^the (?:games|players|byes) of "([^"]*)" of "([^"]*)" are read back$/,
  async function (this: SpecWorld, competition: string, tournament: string) {
    await readBack(this, `${competition} of ${tournament}`);
  },
);

When(
  "the games of the test of {string} are read back",
  async function (this: SpecWorld, tournament: string) {
    await readBack(this, `the test of ${tournament}`);
  },
);

When(
  /^the events of the competition "([^"]*)" of "([^"]*)" are projected again$/,
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    );
    const { projections, store } = scenarioOf(this);
    await this.asARequest(async () => {
      const events = await store.getEvents(id);
      for (const each of projections) await each.project(id, 1, events);
    });
  },
);

const keptOf = (world: SpecWorld): GamesKept => {
  const { kept } = ownScenarioOf(world);
  assert.ok(kept !== undefined, "Nothing was read back.");
  return kept;
};

// What a label is, by the id of the game it names, wherever it is.
const labelOf = (world: SpecWorld, id: string): string => {
  for (const [key, game] of ownScenarioOf(world).games) {
    if (game.value === id) return key.slice(0, key.indexOf(" in "));
  }
  return id;
};

export const nameOfPlayer = (world: SpecWorld, id: string): string => {
  for (const [key, entry] of ownScenarioOf(world).entries) {
    if (entry.value === id) return key.slice(0, key.indexOf(" in "));
  }
  return id;
};

const quoted = (said: string): string[] =>
  [...said.matchAll(/"([^"]*)"/g)].map((each) => each[1]!);

Then(/^the games kept are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    keptOf(this).games.map((each) => labelOf(this, each.id)),
    quoted(said),
  );
});

Then("no games are kept", function (this: SpecWorld) {
  assert.deepEqual(keptOf(this).games, []);
});

const gameKept = (world: SpecWorld, label: string) => {
  const game = keptOf(world).games.find(
    (each) => labelOf(world, each.id) === label,
  );
  assert.ok(game !== undefined, `${label} is not kept.`);
  return game;
};

Then(
  "the game {string} is kept as won by {string}",
  function (this: SpecWorld, label: string, player: string) {
    assert.equal(nameOfPlayer(this, gameKept(this, label).winner), player);
  },
);

Then(
  "the game {string} is kept as lost by {string}",
  function (this: SpecWorld, label: string, player: string) {
    assert.equal(nameOfPlayer(this, gameKept(this, label).loser), player);
  },
);

Then(
  "the game {string} is kept with the scores {string} and {string}",
  function (this: SpecWorld, label: string, winner: string, loser: string) {
    const game = gameKept(this, label);
    assert.deepEqual([game.winnerScore, game.loserScore], [winner, loser]);
  },
);

for (const [said, field, value] of [
  ["drawn", "drawn", true],
  ["not drawn", "drawn", false],
  ["archived", "archived", true],
  ["not archived", "archived", false],
  ["withdrawn", "withdrawn", true],
  ["not withdrawn", "withdrawn", false],
] as const) {
  Then(
    `the game {string} is kept as ${said}`,
    function (this: SpecWorld, label: string) {
      assert.equal(gameKept(this, label)[field], value);
    },
  );
}

// What a game is told as, of what is kept: a game of a withdrawn player is told
// as withdrawn, though the game itself was not.
const toldGame = (world: SpecWorld, label: string) => {
  // This read model is stood up without the tournament's, which is what says
  // who each player is, so they are said here.
  const kept = keptOf(world);
  const who = new Map(kept.who);
  for (const entry of kept.entries) {
    who.set(entry.id, {
      playerId: entry.tournamentPlayerId,
      name: nameOfPlayer(world, entry.id),
      team: undefined,
    });
  }
  const told = gamesToTell(
    "block",
    { ...kept, who },
    ReadOnlyDate.from(new Date("2026-01-01T00:00:00Z")),
  );
  assert.ok("games" in told);
  const game = told.games.find((each) => labelOf(world, each.id) === label);
  assert.ok(game !== undefined, `${label} is not told.`);
  return game;
};

When(
  /^the games of "([^"]*)" of "([^"]*)" are read back without who played them$/,
  async function (this: SpecWorld, competition: string, tournament: string) {
    await readBack(this, `${competition} of ${tournament}`);
    const own = ownScenarioOf(this);
    own.kept = { ...keptOf(this), who: new Map() };
  },
);

Then("telling them is refused", function (this: SpecWorld) {
  assert.throws(
    () =>
      gamesToTell(
        "block",
        keptOf(this),
        ReadOnlyDate.from(new Date("2026-01-01T00:00:00Z")),
      ),
    /names a player it lacks/,
  );
});

Then(
  "the game {string} is told as withdrawn",
  function (this: SpecWorld, label: string) {
    assert.equal(toldGame(this, label).withdrawn, true);
  },
);

Then(
  "the game {string} is told as not withdrawn",
  function (this: SpecWorld, label: string) {
    assert.equal(toldGame(this, label).withdrawn, false);
  },
);

Then(/^the players kept are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    keptOf(this).entries.map((each) => nameOfPlayer(this, each.id)),
    quoted(said),
  );
});

const entryKept = (world: SpecWorld, player: string) => {
  const entry = keptOf(world).entries.find(
    (each) => nameOfPlayer(world, each.id) === player,
  );
  assert.ok(entry !== undefined, `${player} is not kept.`);
  return entry;
};

Then(
  "the player {string} is kept as withdrawn",
  function (this: SpecWorld, player: string) {
    assert.equal(entryKept(this, player).withdrawn, true);
  },
);

Then(
  "the player {string} is kept as not withdrawn",
  function (this: SpecWorld, player: string) {
    assert.equal(entryKept(this, player).withdrawn, false);
  },
);

Then(
  /^the players withdrawn kept are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      keptOf(this)
        .entries.filter((each) => each.withdrawn)
        .map((each) => nameOfPlayer(this, each.id)),
      quoted(said),
    );
  },
);

Then(
  /^(\d+) byes? (?:is|are) kept$/,
  function (this: SpecWorld, count: string) {
    assert.equal(keptOf(this).byes.length, Number(count));
  },
);

Then("no byes are kept", function (this: SpecWorld) {
  assert.deepEqual(keptOf(this).byes, []);
});

Then(
  "1 bye is kept before the player {string} of {string} of {string}",
  function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    const kept = keptOf(this);
    const entry = kept.entries.find(
      (each) =>
        each.id === entryOf(this, player, competition, tournament).value,
    );
    assert.ok(entry !== undefined, `${player} is not kept.`);
    assert.equal(kept.byes.length, 1);
    assert.ok(kept.byes[0]! < entry.order);
  },
);
