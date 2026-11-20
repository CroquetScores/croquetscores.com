import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type {
  CompetitionOfPage,
  PlayerOfPage,
  TournamentOfPage,
} from "../../../../src/application/operations/tournaments/tournamentPages.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { TournamentPages } from "../../../../src/infrastructure/read-models/TournamentPages.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  toBeChanged,
  tournamentNamed,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";
import {
  found,
  ownScenarioOf,
} from "../competition-games/CompetitionGames.steps.js";

// What a tournament, its competitions and their players are, and what is done
// to them, is said in the words the games' read model shares
// (CompetitionGames.steps.ts). What is here is what a page asks of them.

interface Read {
  tournament?: TournamentOfPage | undefined;
  competition?: CompetitionOfPage | undefined;
  asked: boolean;
  players?: readonly PlayerOfPage[];
}

const reads = new WeakMap<SpecWorld, Read>();
const readOf = (world: SpecWorld): Read => {
  let read = reads.get(world);
  if (read === undefined) {
    read = { asked: false };
    reads.set(world, read);
  }
  return read;
};

const pagesOf = (world: SpecWorld): TournamentPages =>
  new TournamentPages(unitOfWorkOf(world));

Given(
  "{string} is subtitled {string}",
  function (this: SpecWorld, name: string, subtitle: string) {
    toBeChanged(this, name, { subtitle });
  },
);

Given(
  "a block named {string} played in {int} rounds is made in {string}",
  async function (
    this: SpecWorld,
    name: string,
    rounds: number,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addBlock(
        id,
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(rounds),
        by,
        at,
      );
    });
  },
);

Given(
  "a block named {string} played to {int} hoops is made in {string}",
  async function (
    this: SpecWorld,
    name: string,
    hoops: number,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addBlock(
        id,
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        by,
        at,
        { maximumHoops: hoops },
      );
    });
  },
);

Given(
  "the block {string} of {string} is set aside",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      each.archiveCompetition(id, by, at);
    });
  },
);

When(
  "the page of {string} is read back",
  async function (this: SpecWorld, name: string) {
    const id = tournamentNamed(this, name).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      readOf(this).tournament = await pages.tournament(id);
    });
  },
);

When(
  "the competition {string} of {string} is read back",
  async function (this: SpecWorld, slug: string, tournament: string) {
    const id = tournamentNamed(this, tournament).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      const read = readOf(this);
      read.asked = true;
      read.competition = await pages.competition(id, slug);
    });
  },
);

When(
  "the players of {string} of {string} are read back for its page",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    ).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      readOf(this).players = await pages.playersOf(id);
    });
  },
);

const tournamentRead = (world: SpecWorld): TournamentOfPage => {
  const { tournament } = readOf(world);
  assert.ok(tournament !== undefined, "No tournament was read back.");
  return tournament;
};

const competitionRead = (world: SpecWorld): CompetitionOfPage => {
  const { competition } = readOf(world);
  assert.ok(competition !== undefined, "No competition was found.");
  return competition;
};

const quoted = (said: string): string[] =>
  [...said.matchAll(/"([^"]*)"/g)].map((each) => each[1]!);

Then(
  "the tournament's page is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentRead(this).name, name);
  },
);

Then(
  "the tournament's page has the subtitle {string}",
  function (this: SpecWorld, subtitle: string) {
    assert.equal(tournamentRead(this).subtitle, subtitle);
  },
);

Then("the tournament's page has no subtitle", function (this: SpecWorld) {
  assert.equal(tournamentRead(this).subtitle, undefined);
});

Then(
  /^the competitions of the page are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      tournamentRead(this).competitions.map((each) => each.name),
      quoted(said),
    );
  },
);

Then(
  "the competition found is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionRead(this).name, name);
  },
);

Then("no competition is found for the page", function (this: SpecWorld) {
  const read = readOf(this);
  assert.ok(read.asked, "No competition was asked for.");
  assert.equal(read.competition, undefined);
});

Then(
  "the competition found is played as the best of {int}",
  function (this: SpecWorld, games: number) {
    assert.equal(competitionRead(this).bestOf, games);
  },
);

Then(
  "the competition found is played in {int} rounds",
  function (this: SpecWorld, rounds: number) {
    assert.equal(competitionRead(this).rounds, rounds);
  },
);

Then(
  "the competition found is played to {int} hoops",
  function (this: SpecWorld, hoops: number) {
    assert.equal(competitionRead(this).maximumHoops, hoops);
  },
);

Then(
  /^the players of the page are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      (readOf(this).players ?? []).map((each) => each.name),
      quoted(said),
    );
  },
);

const playerRead = (world: SpecWorld, name: string): PlayerOfPage => {
  const player = (readOf(world).players ?? []).find(
    (each) => each.name === name,
  );
  assert.ok(player !== undefined, `${name} is not read back.`);
  return player;
};

Then(
  "the player {string} of the page has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(playerRead(this, name).slug, slug);
  },
);

Then(
  "the player {string} of the page is withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(playerRead(this, name).withdrawn, true);
  },
);
