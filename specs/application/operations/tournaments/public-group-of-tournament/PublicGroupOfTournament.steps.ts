import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type GroupToRead,
  PublicGroupOfTournament,
} from "../../../../../src/application/operations/tournaments/PublicGroupOfTournament.js";
import type { CompetitionOfTournament } from "../../../../../src/application/operations/tournaments/tournamentForReaders.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// How each of the group's teams stands is said in the words of the
// tournament's summary (PublicTeamSummaryOfTournament.steps.ts), which a
// group is answered as, and the tournament in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, the group, and
// the group each test is in.

const answered = (world: SpecWorld): GroupToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as GroupToRead;
};

const competitionAnswered = (
  world: SpecWorld,
  name: string,
): CompetitionOfTournament => {
  const found = answered(world).competitions.find(
    (competition) => competition.name === name,
  );
  assert.ok(found !== undefined, `${name} is not answered.`);
  return found;
};

// Asked with nobody signed in.
When(
  "the group {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, group: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicGroupOfTournament("croquetscores.com", address, group),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the group answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).group.name, name);
  },
);

Then(
  "the group answered is found at {string}",
  function (this: SpecWorld, slug: string) {
    assert.equal(answered(this).group.slug, slug);
  },
);

Then(
  "the group's first test answered is found at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(answered(this).tests[0]?.address, address);
  },
);

Then(
  /^(\d+) tests? (?:is|are) answered in the group$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).tests.length, Number(count));
  },
);

Then(
  "the competition {string} is answered in the group {string}",
  function (this: SpecWorld, name: string, group: string) {
    assert.equal(competitionAnswered(this, name).group?.name, group);
  },
);

Then(
  "the competition {string} is answered in the group found at {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(competitionAnswered(this, name).group?.slug, slug);
  },
);

Then(
  "the competition {string} is answered in no group",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionAnswered(this, name).group, undefined);
  },
);
