import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type TournamentNamed,
  TournamentsNamed,
} from "../../../../../src/application/operations/tournaments/TournamentsNamed.js";
import type { SpecWorld } from "../../../../support/world.js";
import { ask, noTournament, tournamentNamed } from "../aRequest.js";

When(
  "the names of {string} are asked for",
  async function (this: SpecWorld, name: string) {
    await ask(this, new TournamentsNamed([tournamentNamed(this, name).value]));
  },
);

When(
  "the names of a tournament there is not are asked for",
  async function (this: SpecWorld) {
    await ask(this, new TournamentsNamed([noTournament().value]));
  },
);

When(
  "the names of {string} as an id are asked for",
  async function (this: SpecWorld, id: string) {
    await ask(this, new TournamentsNamed([id]));
  },
);

const named = (world: SpecWorld): readonly TournamentNamed[] => {
  assert.equal(
    world.failure,
    undefined,
    `Asking failed: ${String(world.failure)}`,
  );
  return world.answer as readonly TournamentNamed[];
};

Then(
  "the tournament named is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(named(this)[0]?.name, name);
  },
);

Then(
  "the tournament named starts in {int}",
  function (this: SpecWorld, year: number) {
    assert.equal(named(this)[0]?.year, year);
  },
);

Then("no tournaments are named", function (this: SpecWorld) {
  assert.deepEqual(named(this), []);
});
