import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { StandingsKept } from "../../../../src/application/operations/tournaments/competitionStandings.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { TieBreak } from "../../../../src/domain/aggregates/tournaments/value-objects/TieBreak.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { CompetitionStandings } from "../../../../src/infrastructure/read-models/CompetitionStandings.js";
import type { SpecWorld } from "../../../support/world.js";
import { at, doneTo } from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";
import {
  doneToCompetition,
  entryOf,
  found,
  nameOfPlayer,
  ownScenarioOf,
} from "../competition-games/CompetitionGames.steps.js";

// What a competition's players and games are, and what is done to them, is said
// in the words the games' read model shares (CompetitionGames.steps.ts). What
// is here is what a block is played as, what a player carries forward, and
// what is read back of the standings.

const read = new WeakMap<SpecWorld, StandingsKept>();

Given(
  "a Swiss named {string} is made in {string}",
  async function (this: SpecWorld, name: string, tournament: string) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addSwiss(id, CompetitionName.from(name), BestOf.from(1), by, at);
    });
  },
);

Given(
  "the tie break of {string} of {string} is changed to who beat who",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      each.updateBlock(
        id,
        CompetitionName.from(competition),
        BestOf.from(1),
        Rounds.from(1),
        true,
        by,
        at,
        undefined,
        TieBreak.whoBeatWho,
      );
    });
  },
);

Given(
  "the player {string} in {string} of {string} carries forward {int} match wins",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
    wins: number,
  ) {
    const id = entryOf(this, player, competition, tournament);
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      each.changeCarryForward(id, { matchWins: wins }, told(), by, at);
    });
  },
);

When(
  "the standings of {string} of {string} are read back",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    ).value;
    const standings = new CompetitionStandings(unitOfWorkOf(this));
    await this.asARequest(async () => {
      read.set(this, await standings.standingsKept(id));
    });
  },
);

const kept = (world: SpecWorld): StandingsKept => {
  const standings = read.get(world);
  assert.ok(standings !== undefined, "Nothing was read back.");
  return standings;
};

const quoted = (said: string): string[] =>
  [...said.matchAll(/"([^"]*)"/g)].map((each) => each[1]!);

Then(/^the standings kept are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    kept(this).standings.map((each) => nameOfPlayer(this, each.entryId)),
    quoted(said),
  );
});

Then("no standings are kept", function (this: SpecWorld) {
  assert.deepEqual(kept(this).standings, []);
});

const lineOf = (world: SpecWorld, player: string) => {
  const line = kept(world).standings.find(
    (each) => nameOfPlayer(world, each.entryId) === player,
  );
  assert.ok(line !== undefined, `${player} has no standing kept.`);
  return line;
};

Then(
  "the player {string} has no place",
  function (this: SpecWorld, player: string) {
    assert.equal(lineOf(this, player).place, undefined);
  },
);

Then(
  "the player {string} has the place {int}",
  function (this: SpecWorld, player: string, place: number) {
    assert.equal(lineOf(this, player).place, place);
  },
);

Then(
  /^the place of "([^"]*)" is kept as (not )?shared$/,
  function (this: SpecWorld, player: string, not: string | null) {
    assert.equal(lineOf(this, player).shared, !not);
  },
);

Then(
  /^the player "([^"]*)" has won (\d+) match(?:es)?$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).won, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has lost (\d+) match(?:es)?$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).lost, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has won (\d+) games?$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).gamesWon, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has won (\d+) games? in the Swiss$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).won, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has played (\d+) games?$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).played, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has the net games (-?\d+)$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).netGames, Number(count));
  },
);

Then(
  /^the player "([^"]*)" has the net hoops (-?\d+)$/,
  function (this: SpecWorld, player: string, count: string) {
    assert.equal(lineOf(this, player).netHoops, Number(count));
  },
);

Then(
  "nobody is level on the matches they have won",
  function (this: SpecWorld) {
    assert.equal(kept(this).levelOnMatchesWon, false);
  },
);

Then(
  "somebody is level on the matches they have won",
  function (this: SpecWorld) {
    assert.equal(kept(this).levelOnMatchesWon, true);
  },
);
