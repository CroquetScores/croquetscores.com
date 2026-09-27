import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type ListedScorer,
  ScorersOfTournament,
} from "../../../../../src/application/operations/tournaments/ScorersOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

// The scorers answered, once the list was not refused: a step reading them
// from a refused list would say nobody scores when the truth is that nobody
// was told.
const answered = (world: SpecWorld): readonly ListedScorer[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as readonly ListedScorer[];
};

const names = (world: SpecWorld): string[] =>
  answered(world).map(({ name }) => name);

When(
  "the reader signed in to the account for {string} lists the scorers of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new ScorersOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the scorers of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new ScorersOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the scorers of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(this, new ScorersOfTournament(account, noTournament().value));
  },
);

Then("no scorers are answered", function (this: SpecWorld) {
  assert.deepEqual(names(this), []);
});

Then(
  "the scorer {string} is answered",
  function (this: SpecWorld, name: string) {
    assert.ok(
      names(this).includes(name),
      `The scorers answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the scorer {string} is not answered",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !names(this).includes(name),
      `The scorers answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the first scorer answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(names(this)[0], name);
  },
);
