import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { archiveCompetition } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  "the reader signed in to the account for {string} archives the competition {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
  ) {
    const account = await asTheReader(this, address);
    await archiveCompetition(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to that account archives the competition {string} in {string}",
  async function (this: SpecWorld, thing: string, name: string) {
    const account = heldAccount(this);
    await archiveCompetition(this, account, tournamentNamed(this, name), thing);
  },
);

When(
  "the reader signed in to the account for {string} archives a competition {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await asTheReader(this, address);
    await archiveCompetition(
      this,
      account,
      tournamentNamed(this, name),
      undefined,
    );
  },
);

When(
  "the reader signed in to that account archives a competition {string} does not have",
  async function (this: SpecWorld, name: string) {
    const account = heldAccount(this);
    await archiveCompetition(
      this,
      account,
      tournamentNamed(this, name),
      undefined,
    );
  },
);

When(
  "the reader signed in to the account for {string} archives the competition {string} in a tournament there is not",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await archiveCompetition(this, account, noTournament(), thing);
  },
);

When(
  "the reader signed in to that account archives the competition {string} in a tournament there is not",
  async function (this: SpecWorld, thing: string) {
    const account = heldAccount(this);
    await archiveCompetition(this, account, noTournament(), thing);
  },
);
