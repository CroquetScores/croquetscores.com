import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { removeScorer } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} takes {string} off the scorers of {string}",
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
  ) {
    const account = await asTheReader(this, address);
    await removeScorer(
      this,
      account,
      tournamentNamed(this, name),
      (await accountFor(this, thing)).value,
    );
  },
);

When(
  "the reader signed in to that account takes {string} off the scorers of {string}",
  async function (this: SpecWorld, thing: string, name: string) {
    const account = heldAccount(this);
    await removeScorer(
      this,
      account,
      tournamentNamed(this, name),
      (await accountFor(this, thing)).value,
    );
  },
);

When(
  "the reader signed in to the account for {string} takes {string} off the scorers of a tournament there is not",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await removeScorer(
      this,
      account,
      noTournament(),
      (await accountFor(this, thing)).value,
    );
  },
);

When(
  "the reader signed in to that account takes {string} off the scorers of a tournament there is not",
  async function (this: SpecWorld, thing: string) {
    const account = heldAccount(this);
    await removeScorer(
      this,
      account,
      noTournament(),
      (await accountFor(this, thing)).value,
    );
  },
);
