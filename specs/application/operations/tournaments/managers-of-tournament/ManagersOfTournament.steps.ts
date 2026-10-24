import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type ListedManager,
  type ManagersListed,
  ManagersOfTournament,
} from "../../../../../src/application/operations/tournaments/ManagersOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

// The managers answered, once the list was not refused: a step reading them
// from a refused list would say nobody manages when the truth is that nobody
// was told.
const listed = (world: SpecWorld): ManagersListed => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as ManagersListed;
};

const answered = (world: SpecWorld): readonly ListedManager[] =>
  listed(world).managers;

const names = (world: SpecWorld): string[] =>
  answered(world).map(({ name }) => name);

const managerCalled = (world: SpecWorld, name: string): ListedManager => {
  const found = answered(world).find((manager) => manager.name === name);
  assert.ok(
    found !== undefined,
    `The managers answered are ${JSON.stringify(names(world))}.`,
  );
  return found;
};

When(
  "the reader signed in to the account for {string} lists the managers of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new ManagersOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the managers of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new ManagersOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the managers of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(this, new ManagersOfTournament(account, noTournament().value));
  },
);

Then(
  "the manager {string} is answered",
  function (this: SpecWorld, name: string) {
    managerCalled(this, name);
  },
);

Then(
  "the manager {string} is not answered",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !names(this).includes(name),
      `The managers answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the first manager answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(names(this)[0], name);
  },
);

Then(
  /^(\d+) managers? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      answered(this).length,
      Number(count),
      `The managers answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the manager {string} is answered as the reader",
  function (this: SpecWorld, name: string) {
    assert.equal(managerCalled(this, name).isReader, true);
  },
);

Then(
  "the manager {string} is not answered as the reader",
  function (this: SpecWorld, name: string) {
    assert.equal(managerCalled(this, name).isReader, false);
  },
);

Then(
  "the manager {string} is answered with the email address {string}",
  function (this: SpecWorld, name: string, emailAddress: string) {
    assert.equal(managerCalled(this, name).emailAddress, emailAddress);
  },
);

Then(
  "the manager {string} is answered with no email address",
  function (this: SpecWorld, name: string) {
    assert.equal(managerCalled(this, name).emailAddress, undefined);
  },
);

Then(
  "the managers are answered as ones the reader may change",
  function (this: SpecWorld) {
    assert.equal(listed(this).mayChange, true);
  },
);

Then(
  "the managers are answered as ones the reader may not change",
  function (this: SpecWorld) {
    assert.equal(listed(this).mayChange, false);
  },
);
