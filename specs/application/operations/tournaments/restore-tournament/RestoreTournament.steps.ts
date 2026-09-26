import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { restore } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} restores the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await asTheReader(this, address);
    await restore(this, account, tournamentNamed(this, name));
  },
);

When(
  "the reader signed in to that account restores the tournament {string}",
  async function (this: SpecWorld, name: string) {
    const account = heldAccount(this);
    await restore(this, account, tournamentNamed(this, name));
  },
);

When(
  "the reader signed in to the account for {string} restores a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = await asTheReader(this, address);
    await restore(this, account, noTournament());
  },
);

When(
  "the reader signed in to that account restores a tournament there is not",
  async function (this: SpecWorld) {
    const account = heldAccount(this);
    await restore(this, account, noTournament());
  },
);
