import { When } from "@cucumber/cucumber";

import { strict as assert } from "node:assert";

import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  everyCreated,
  heldAccount,
  inHandOf,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { update } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} updates the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await asTheReader(this, address);
    await update(this, account, tournamentNamed(this, name));
  },
);

When(
  "the reader signed in to that account updates the tournament {string}",
  async function (this: SpecWorld, name: string) {
    const account = heldAccount(this);
    await update(this, account, tournamentNamed(this, name));
  },
);

When(
  "the reader signed in to the account for {string} updates a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = await asTheReader(this, address);
    await update(this, account, noTournament());
  },
);

When(
  "the reader signed in to that account updates a tournament there is not",
  async function (this: SpecWorld) {
    const account = heldAccount(this);
    await update(this, account, noTournament());
  },
);

// Where two tournaments have the one name, the one found at `address`.
const foundAt = async (
  world: SpecWorld,
  address: string,
): Promise<TournamentId> => {
  for (const id of everyCreated(world)) {
    const tournament = await inHandOf(world).load(id);
    if (tournament?.address.toString() === address) return id;
  }
  assert.fail(`No tournament created is found at ${address}.`);
};

When(
  "the reader signed in to the account for {string} updates the tournament {string} found at {string}",
  async function (this: SpecWorld, address: string, _name: string, at: string) {
    await update(
      this,
      await asTheReader(this, address),
      await foundAt(this, at),
    );
  },
);
