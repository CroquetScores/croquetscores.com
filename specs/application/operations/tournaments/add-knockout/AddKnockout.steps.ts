import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  load,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import { addKnockout, sayLosersKnockout } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} adds the knockout {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
  ) {
    const account = await asTheReader(this, address);
    await addKnockout(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to that account adds the knockout {string} to {string}",
  async function (this: SpecWorld, thing: string, name: string) {
    const account = heldAccount(this);
    await addKnockout(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to the account for {string} adds the knockout {string} to a tournament there is not",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await addKnockout(this, account, noTournament(), thing);
  },
);

When(
  "the reader signed in to that account adds the knockout {string} to a tournament there is not",
  async function (this: SpecWorld, thing: string) {
    const account = heldAccount(this);
    await addKnockout(this, account, noTournament(), thing);
  },
);

Given(
  "the knockout is to have its {word} round's losers played on in {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    sayLosersKnockout(this, { name, round: positionOf(ordinal) });
  },
);

const competitionsOf = async (world: SpecWorld, tournament: string) =>
  (await load(world, tournamentNamed(world, tournament))).competitions;

Then(
  "the tournament {string} has no competition {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    assert.equal(
      (await competitionsOf(this, tournament)).filter(
        ({ reference }) => reference.name.toString() === name,
      ).length,
      0,
    );
  },
);

Then(
  "the tournament's competition {string} was added for the losers of the {word} round of {string}",
  async function (
    this: SpecWorld,
    name: string,
    ordinal: string,
    from: string,
  ) {
    const all = await competitionsOf(this, "Spring Open");
    const named = (wanted: string) =>
      all.find(({ reference }) => reference.name.toString() === wanted);
    const found = named(name);
    const source = named(from);
    assert.ok(found?.shape.kind === "knockout" && source !== undefined);
    assert.equal(
      found.shape.losersOf?.competitionId.value,
      source.reference.id.value,
    );
    assert.equal(found.shape.losersOf.round, positionOf(ordinal));
  },
);
