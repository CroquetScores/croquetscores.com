import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import {
  importingOf,
  listOf,
  orderedDocument,
  tournamentKeptFor,
} from "../importingTournaments.js";

Given(
  "the tournament {string} on {string} lists {string}",
  function (this: SpecWorld, id: string, website: string, competition: string) {
    listOf(this, website, id).push(competition);
    importingOf(this).ordering = { website, id };
  },
);

When(
  "the tournament's competitions are put in order",
  async function (this: SpecWorld) {
    const state = importingOf(this);
    state.refused = undefined;
    try {
      await state.importers.order.importDocument(orderedDocument(this));
    } catch (failure) {
      state.refused = failure;
    }
  },
);

// The competitions in use, in the order the tournament lists them.
const competitionNames = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<string[]> =>
  (await tournamentKeptFor(world, id, website)).competitions
    .filter(({ reference }) => !reference.archived)
    .map(({ reference }) => reference.name.toString());

Then(
  /^the (first|last) competition of the tournament kept for "(.*)" on "(.*)" is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    id: string,
    website: string,
    name: string,
  ) {
    const names = await competitionNames(this, id, website);
    assert.equal(
      which === "first" ? names[0] : names.at(-1),
      name,
      names.join(", "),
    );
  },
);
