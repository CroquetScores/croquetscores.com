import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  PlayersOfTest,
  type TeamInTest,
} from "../../../../../src/application/operations/competitions/PlayersOfTest.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import { ask, tournamentNamed } from "../../tournaments/aRequest.js";
import { competitionIn } from "../../tournaments/requests.js";
import { readerOf } from "../../tournaments/teamRequests.js";
import { teamAnswered } from "../../tournaments/teams-of-tournament/teamsAnswered.js";

const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

const listing = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: ReturnType<typeof tournamentNamed>,
  test: string | undefined,
): Promise<void> => {
  await ask(
    world,
    new PlayersOfTest(
      await readerOf(world, address ?? undefined),
      tournament.value,
      (await competitionIn(world, tournament, test)).value,
    ),
  );
};

// Listing a test's players in the words a competition's are listed in is the
// competition's steps' (`competitionOperations.steps.ts`), which ask a test's
// own list where the competition named is a test. "As a test" asks a
// competition of another kind for a test's players.
When(
  new RegExp(
    `${READER} lists the players of "([^"]*)" of "([^"]*)" as a test$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    test: string,
    name: string,
  ) {
    await listing(this, address, tournamentNamed(this, name), test);
  },
);

When(
  new RegExp(`${READER} lists the players of a test "([^"]*)" does not have$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    await listing(this, address, tournamentNamed(this, name), undefined);
  },
);

const playersOf = (world: SpecWorld, team: string): string[] =>
  (teamAnswered(world, team) as TeamInTest).players.map(({ name }) => name);

Then(
  "the team {string} is answered with the player {string}",
  function (this: SpecWorld, team: string, name: string) {
    const names = playersOf(this, team);
    assert.ok(names.includes(name), `It answered ${JSON.stringify(names)}.`);
  },
);

Then(
  "the team {string} is not answered with the player {string}",
  function (this: SpecWorld, team: string, name: string) {
    const names = playersOf(this, team);
    assert.ok(!names.includes(name), `It answered ${JSON.stringify(names)}.`);
  },
);

Then(
  "the {word} player of the team {string} answered is {string}",
  function (this: SpecWorld, ordinal: string, team: string, name: string) {
    assert.equal(playersOf(this, team)[positionOf(ordinal)], name);
  },
);
