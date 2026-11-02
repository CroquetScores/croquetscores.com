import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  CompetitionsOfTournament,
  type ListedCompetition,
} from "../../../../../src/application/operations/tournaments/CompetitionsOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

// The competitions answered, once the list was not refused: a step reading
// them from a refused list would say there are none when the truth is that
// nobody was told.
const answered = (world: SpecWorld): readonly ListedCompetition[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as readonly ListedCompetition[];
};

const names = (world: SpecWorld): string[] =>
  answered(world).map(({ name }) => name);

const competitionCalled = (
  world: SpecWorld,
  name: string,
): ListedCompetition => {
  const found = answered(world).find(
    (competition) => competition.name === name,
  );
  assert.ok(
    found !== undefined,
    `The competitions answered are ${JSON.stringify(names(world))}.`,
  );
  return found;
};

When(
  "the reader signed in to the account for {string} lists the competitions of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new CompetitionsOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the competitions of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new CompetitionsOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the competitions of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new CompetitionsOfTournament(account, noTournament().value),
    );
  },
);

Then("no competitions are answered", function (this: SpecWorld) {
  assert.deepEqual(names(this), []);
});

Then(
  "the first competition answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(
      names(this)[0],
      name,
      `The competitions answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the competition {string} is answered as archived",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionCalled(this, name).archived, true);
  },
);

Then(
  "the competition {string} is answered as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionCalled(this, name).archived, false);
  },
);

Then(
  "the competition {string} is answered with the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(competitionCalled(this, name).slug, slug);
  },
);

Then(
  /^the competition "([^"]*)" is answered as (not )?played under handicap$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(competitionCalled(this, name).handicap, not === null);
  },
);

Then(
  /^the competition "([^"]*)" is answered as allowing drawn results$/,
  function (this: SpecWorld, name: string) {
    assert.equal(competitionCalled(this, name).drawsAllowed, true);
  },
);

Then(
  /^the competition "([^"]*)" is answered as (not )?counting towards the world rankings$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(competitionCalled(this, name).worldRankings, not === null);
  },
);

// Said as the features say a kind, "a Swiss" among them, and answered as the
// application writes one.
Then(
  /^the competition "([^"]*)" is answered as a (block|knockout|Swiss|test)$/,
  function (this: SpecWorld, name: string, kind: string) {
    assert.equal(competitionCalled(this, name).kind, kind.toLowerCase());
  },
);

// Its shape --------------------------------------------------------------------

Then(
  "the competition {string} is answered as the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    const competition = competitionCalled(this, name);
    assert.ok(
      competition.kind !== "knockout",
      `${name} is answered as a knockout.`,
    );
    assert.equal(competition.bestOf, games);
  },
);

Then(
  "the competition {string} is answered as played in {int} round(s)",
  function (this: SpecWorld, name: string, rounds: number) {
    const competition = competitionCalled(this, name);
    assert.ok(
      competition.kind === "block",
      `${name} is answered as a ${competition.kind}.`,
    );
    assert.equal(competition.rounds, rounds);
  },
);

Then(
  "the competition {string} is answered as going by the tie break {string}",
  function (this: SpecWorld, name: string, code: string) {
    const competition = competitionCalled(this, name);
    assert.ok(
      competition.kind === "block",
      `${name} is answered as a ${competition.kind}.`,
    );
    assert.equal(competition.tieBreak, code);
  },
);

const knockoutCalled = (
  world: SpecWorld,
  name: string,
): Extract<ListedCompetition, { kind: "knockout" }> => {
  const competition = competitionCalled(world, name);
  assert.ok(
    competition.kind === "knockout",
    `${name} is answered as a ${competition.kind}.`,
  );
  return competition;
};

Then(
  "the knockout {string} is answered with {int} places",
  function (this: SpecWorld, name: string, places: number) {
    assert.equal(knockoutCalled(this, name).places, places);
  },
);

Then(
  /^the (first|second) round of the knockout "([^"]*)" is answered as the best of (\d+)$/,
  function (this: SpecWorld, round: string, name: string, games: string) {
    assert.equal(
      knockoutCalled(this, name).rounds[round === "first" ? 0 : 1],
      Number(games),
    );
  },
);

// A test ------------------------------------------------------------------------

const testCalled = (
  world: SpecWorld,
  name: string,
): Extract<ListedCompetition, { kind: "test" }> => {
  const competition = competitionCalled(world, name);
  assert.ok(
    competition.kind === "test",
    `${name} is answered as a ${competition.kind}.`,
  );
  return competition;
};

Then(
  /^the test "([^"]*)" is answered with the (first|second) team "([^"]*)"$/,
  function (this: SpecWorld, name: string, which: string, team: string) {
    const { teams } = testCalled(this, name);
    assert.equal(teams[which === "first" ? 0 : 1]?.name, team);
  },
);

Then(
  "the test {string} is answered starting on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(testCalled(this, name).starts, day);
  },
);

Then(
  "the test {string} is answered finishing on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(testCalled(this, name).finishes, day);
  },
);

Then(
  "the test {string} is answered expected to have {int} matches",
  function (this: SpecWorld, name: string, count: number) {
    assert.equal(testCalled(this, name).expectedMatches, count);
  },
);

Then(
  "the test {string} is answered in the group {string}",
  function (this: SpecWorld, name: string, group: string) {
    assert.equal(testCalled(this, name).group, group);
  },
);

Then(
  "the test {string} is answered in no group",
  function (this: SpecWorld, name: string) {
    assert.equal(testCalled(this, name).group, undefined);
  },
);

Then(
  /^the test "([^"]*)" is answered as having (no )?games$/,
  function (this: SpecWorld, name: string, no: string | null) {
    assert.equal(testCalled(this, name).hasGames, no === null);
  },
);
