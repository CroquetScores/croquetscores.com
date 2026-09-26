import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { addBlock } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} adds the block {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
  ) {
    const account = await asTheReader(this, address);
    await addBlock(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to that account adds the block {string} to {string}",
  async function (this: SpecWorld, thing: string, name: string) {
    const account = heldAccount(this);
    await addBlock(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to the account for {string} adds the block {string} to a tournament there is not",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await addBlock(this, account, noTournament(), thing);
  },
);

When(
  "the reader signed in to that account adds the block {string} to a tournament there is not",
  async function (this: SpecWorld, thing: string) {
    const account = heldAccount(this);
    await addBlock(this, account, noTournament(), thing);
  },
);
