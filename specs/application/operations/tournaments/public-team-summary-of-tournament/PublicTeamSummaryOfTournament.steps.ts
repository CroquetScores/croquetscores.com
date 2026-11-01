import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  PublicTeamSummaryOfTournament,
  type TeamStanding,
  type TeamSummaryToRead,
} from "../../../../../src/application/operations/tournaments/PublicTeamSummaryOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and how each team
// stands.

const answered = (world: SpecWorld): TeamSummaryToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as TeamSummaryToRead;
};

const places = ["first", "second", "third"];

const teamAnswered = (world: SpecWorld, name: string): TeamStanding => {
  const team = answered(world).teams.find((each) => each.name === name);
  assert.ok(team !== undefined, `${name} is not answered.`);
  return team;
};

// Asked with nobody signed in.
When(
  "the summary of the teams of the tournament at {string} is asked for",
  async function (this: SpecWorld, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicTeamSummaryOfTournament("croquetscores.com", address),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the team {string} is answered in the summary known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    assert.equal(teamAnswered(this, name).shortName, shortName);
  },
);

Then(
  /^(\d+) teams? (?:is|are) answered in the summary$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).teams.length, Number(count));
  },
);

// What each count is called in a scenario, and where a team has it.
const counts: Readonly<Record<string, keyof TeamStanding>> = {
  "test won": "testsWon",
  "tests won": "testsWon",
  "test lost": "testsLost",
  "tests lost": "testsLost",
  "test drawn": "testsDrawn",
  "tests drawn": "testsDrawn",
  "match won": "matchesWon",
  "matches won": "matchesWon",
  "match lost": "matchesLost",
  "matches lost": "matchesLost",
  "game won": "gamesWon",
  "games won": "gamesWon",
  "game lost": "gamesLost",
  "games lost": "gamesLost",
  "hoops for": "hoopsFor",
  "hoops against": "hoopsAgainst",
};

Then(
  /^the team "(.*)" is answered in the summary with (\d+) (tests? won|tests? lost|tests? drawn|match(?:es)? won|match(?:es)? lost|games? won|games? lost|hoops for|hoops against)$/,
  function (this: SpecWorld, name: string, count: string, what: string) {
    const field = counts[what];
    assert.ok(field !== undefined, `Nothing is counted as ${what}.`);
    assert.equal(teamAnswered(this, name)[field], Number(count));
  },
);

// A net is the difference of two counts the answer already gives, so it is
// worked out here rather than asked of the answer.
Then(
  /^the team "(.*)" is answered in the summary with (-?\d+) net (match|matches|game|games)$/,
  function (this: SpecWorld, name: string, net: string, what: string) {
    const team = teamAnswered(this, name);
    assert.equal(
      what.startsWith("match")
        ? team.matchesWon - team.matchesLost
        : team.gamesWon - team.gamesLost,
      Number(net),
    );
  },
);

Then(
  /^the summary is answered as (showing|not showing) net matches and net games$/,
  function (this: SpecWorld, which: string) {
    assert.equal(answered(this).showsNets, which === "showing");
  },
);

Then(
  /^the (first|second|third) team of the summary ranked is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const id = answered(this).ranked[places.indexOf(which)];
    assert.ok(id !== undefined, `No ${which} team is ranked.`);
    assert.equal(
      answered(this).teams.find((each) => each.id === id)?.name,
      name,
    );
  },
);

Then(
  /^the summary is answered with (a|no) test of matches the best of more than 1$/,
  function (this: SpecWorld, which: string) {
    assert.equal(answered(this).bestOfMoreThanOne, which === "a");
  },
);
