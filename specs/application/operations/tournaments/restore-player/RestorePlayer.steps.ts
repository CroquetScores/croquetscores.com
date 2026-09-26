import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { restorePlayer } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} restores the player {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
  ) {
    const account = await asTheReader(this, address);
    await restorePlayer(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to that account restores the player {string} in {string}",
  async function (this: SpecWorld, thing: string, name: string) {
    const account = heldAccount(this);
    await restorePlayer(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to the account for {string} restores a player {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await asTheReader(this, address);
    await restorePlayer(this, account, tournamentNamed(this, name), undefined);
  },
);

When(
  "the reader signed in to that account restores a player {string} does not have",
  async function (this: SpecWorld, name: string) {
    const account = heldAccount(this);
    await restorePlayer(this, account, tournamentNamed(this, name), undefined);
  },
);

When(
  "the reader signed in to the account for {string} restores the player {string} in a tournament there is not",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await restorePlayer(this, account, noTournament(), thing);
  },
);

When(
  "the reader signed in to that account restores the player {string} in a tournament there is not",
  async function (this: SpecWorld, thing: string) {
    const account = heldAccount(this);
    await restorePlayer(this, account, noTournament(), thing);
  },
);
