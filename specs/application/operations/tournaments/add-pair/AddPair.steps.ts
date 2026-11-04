import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  AddPair,
  type AddedPair,
} from "../../../../../src/application/operations/tournaments/AddPair.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { tournamentOf } from "../../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  accountFor,
  heldAccount,
  inHandOf,
  lookAt,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";

// The tournament's player called `name`, by their id, or an id nobody has
// where the tournament has none called that, or where there is no tournament:
// a scenario names a player the tournament does not have by a name it does not
// have.
const playerIdIn = async (
  world: SpecWorld,
  tournament: TournamentId,
  name: string,
): Promise<string> => {
  const found = (await inHandOf(world).load(tournament))?.players.find(
    (player) => player.name.toString() === name,
  );
  return (found?.id ?? TournamentPlayerId.create()).value;
};

const pairing = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  first: string,
  second: string,
): Promise<void> => {
  await send(
    world,
    new AddPair(
      account,
      tournament.value,
      await playerIdIn(world, tournament, first),
      await playerIdIn(world, tournament, second),
      momentOf(world),
    ),
    tournament,
  );
};

When(
  "the reader signed in to the account for {string} pairs the players {string} and {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    first: string,
    second: string,
    name: string,
  ) {
    await pairing(
      this,
      (await accountFor(this, address)).value,
      tournamentNamed(this, name),
      first,
      second,
    );
  },
);

When(
  "the reader signed in to that account pairs the players {string} and {string} in {string}",
  async function (
    this: SpecWorld,
    first: string,
    second: string,
    name: string,
  ) {
    await pairing(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      first,
      second,
    );
  },
);

When(
  "the reader signed in to the account for {string} pairs the players {string} and {string} in a tournament there is not",
  async function (
    this: SpecWorld,
    address: string,
    first: string,
    second: string,
  ) {
    await pairing(
      this,
      (await accountFor(this, address)).value,
      noTournament(),
      first,
      second,
    );
  },
);

// Done before the scenario's own request, and not refused: a scenario that says
// it was done is not about whether it could be.
Given(
  "{string} has paired the players {string} and {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    first: string,
    second: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await inHandOf(this).send(
      new AddPair(
        (await accountFor(this, address)).value,
        tournament.value,
        await playerIdIn(this, tournament, first),
        await playerIdIn(this, tournament, second),
        momentOf(this),
      ),
    );
    await lookAt(this, tournament);
  },
);

Then(
  "the tournament does not have the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !tournamentOf(this).players.some(
        (player) => player.name.toString() === name,
      ),
      `The tournament has the player ${name}.`,
    );
  },
);

const pairAnswered = (world: SpecWorld): AddedPair => world.answer as AddedPair;

Then(
  "the pair answered is the tournament's player {string}",
  function (this: SpecWorld, name: string) {
    const player = tournamentOf(this).players.find(
      (each) => each.name.toString() === name,
    );
    assert.ok(player !== undefined, `The tournament has no player ${name}.`);
    assert.ok(player.id.equals(pairAnswered(this).id));
  },
);

Then(
  "the pair answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(pairAnswered(this).name, name);
  },
);

Then(
  "the tournament's player {string} represents nothing",
  function (this: SpecWorld, name: string) {
    const player = tournamentOf(this).players.find(
      (each) => each.name.toString() === name,
    );
    assert.ok(player !== undefined, `The tournament has no player ${name}.`);
    assert.equal(player.representing, undefined);
  },
);
