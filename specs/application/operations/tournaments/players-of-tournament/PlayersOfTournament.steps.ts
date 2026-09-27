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
// was told.
const answered = (world: SpecWorld): readonly ListedPlayer[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as readonly ListedPlayer[];
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
  "the player {string} is answered",
  function (this: SpecWorld, name: string) {
    playerCalled(this, name);
  },
);

Then(
  "the first player answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(
      names(this)[0],
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
