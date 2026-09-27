import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { moveCompetition } from "../requests.js";

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

When(
  /^the reader signed in to the account for "([^"]*)" moves the competition "([^"]*)" in "([^"]*)" (up|down)$/,
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
    direction: string,
  ) {
    const account = await asTheReader(this, address);
    await moveCompetition(
      this,
      account,
      tournamentNamed(this, name),
      thing,
      direction,
    );
  },
);

// A way to move that is neither up nor down, as a request could say one.
When(
  /^the reader signed in to the account for "([^"]*)" moves the competition "([^"]*)" in "([^"]*)" "([^"]*)"$/,
  async function (
    this: SpecWorld,
    address: string,
    thing: string,
    name: string,
    direction: string,
  ) {
    const account = await asTheReader(this, address);
    await moveCompetition(
      this,
      account,
      tournamentNamed(this, name),
      thing,
      direction,
    );
  },
);

When(
  "the reader signed in to that account moves the competition {string} in {string} up",
  async function (this: SpecWorld, thing: string, name: string) {
    await moveCompetition(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      thing,
      "up",
    );
  },
);

When(
  "the reader signed in to the account for {string} moves a competition {string} does not have up",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await asTheReader(this, address);
    await moveCompetition(
      this,
      account,
      tournamentNamed(this, name),
      undefined,
      "up",
    );
  },
);

When(
  "the reader signed in to the account for {string} moves the competition {string} in a tournament there is not up",
  async function (this: SpecWorld, address: string, thing: string) {
    const account = await asTheReader(this, address);
    await moveCompetition(this, account, noTournament(), thing, "up");
  },
);
