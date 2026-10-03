import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type ListedPlayer,
  PlayersOfTournament,
} from "../../../../../src/application/operations/tournaments/PlayersOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

// The players answered, once the list was not refused: a step reading them
// from a refused list would say there are none when the truth is that nobody
// was told. Either the list itself, as the tournament's managers have it, or
// the players of a page that answers more than its players, as a reader's
// players' page does (PublicPlayersOfTournament.feature), whose players have
// what the steps reading both ask of them: a name, what they represent and the
// flag they fly.
const answered = (world: SpecWorld): readonly ListedPlayer[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return Array.isArray(world.answer)
    ? (world.answer as readonly ListedPlayer[])
    : (world.answer as { players: readonly ListedPlayer[] }).players;
};

const names = (world: SpecWorld): string[] =>
  answered(world).map(({ name }) => name);

const playerCalled = (world: SpecWorld, name: string): ListedPlayer => {
  const found = answered(world).find((player) => player.name === name);
  assert.ok(
    found !== undefined,
    `The players answered are ${JSON.stringify(names(world))}.`,
  );
  return found;
};

When(
  "the reader signed in to the account for {string} lists the players of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new PlayersOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the players of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new PlayersOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the players of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(this, new PlayersOfTournament(account, noTournament().value));
  },
);

Then("no players are answered", function (this: SpecWorld) {
  assert.deepEqual(names(this), []);
});

Then(
  /^(\d+) players? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(names(this).length, Number(count));
  },
);

Then(
  "the player {string} is answered",
  function (this: SpecWorld, name: string) {
    playerCalled(this, name);
  },
);

Then(
  /^the (first|second|third) player answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      names(this)[["first", "second", "third"].indexOf(which)],
      name,
      `The players answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the player {string} is answered representing {string}",
  function (this: SpecWorld, name: string, representing: string) {
    assert.equal(playerCalled(this, name).representing, representing);
  },
);

Then(
  "the player {string} is answered flying the flag {string}",
  function (this: SpecWorld, name: string, flag: string) {
    assert.equal(playerCalled(this, name).flag, flag);
  },
);

Then(
  "the player {string} is answered as archived",
  function (this: SpecWorld, name: string) {
    assert.equal(playerCalled(this, name).archived, true);
  },
);

Then(
  "the player {string} is answered as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(playerCalled(this, name).archived, false);
  },
);

Then(
  "the player {string} is answered as having played",
  function (this: SpecWorld, name: string) {
    assert.equal(playerCalled(this, name).hasPlayed, true);
  },
);

Then(
  "the player {string} is answered as not having played",
  function (this: SpecWorld, name: string) {
    assert.equal(playerCalled(this, name).hasPlayed, false);
  },
);

Then(
  "the player {string} is answered in no competitions",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(playerCalled(this, name).competitions, []);
  },
);

Then(
  "the player {string} is answered in the competition {string}",
  function (this: SpecWorld, name: string, competition: string) {
    assert.ok(
      playerCalled(this, name).competitions.includes(competition),
      `${name} is answered in ${JSON.stringify(playerCalled(this, name).competitions)}.`,
    );
  },
);

Then(
  "the player {string} is not answered in the competition {string}",
  function (this: SpecWorld, name: string, competition: string) {
    assert.ok(!playerCalled(this, name).competitions.includes(competition));
  },
);

Then(
  "the first competition the player {string} is answered in is {string}",
  function (this: SpecWorld, name: string, competition: string) {
    assert.equal(playerCalled(this, name).competitions[0], competition);
  },
);
