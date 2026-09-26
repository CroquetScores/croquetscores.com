import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentName.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character. A capital and a
// lower-case one, since a name all in either is refused whatever its length.
const ACCENTED_CAPITAL = "Ö".normalize("NFD");
const ACCENTED = "ö".normalize("NFD");

// A name of `length` characters that is refused for nothing but its length:
// a capital, then lower case.
const nameOf = (length: number, capital: string, rest: string): string =>
  length === 0 ? "" : capital + rest.repeat(length - 1);

// Making a name may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    world.tournamentName = TournamentName.from(given);
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the tournament name {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a tournament name of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, nameOf(length, "A", "a"));
  },
);

When(
  "a tournament name of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, nameOf(length, ACCENTED_CAPITAL, ACCENTED));
  },
);

Then(
  "the tournament name is written {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      this.tournamentName !== undefined,
      `No tournament name has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(this.tournamentName), name);
  },
);
