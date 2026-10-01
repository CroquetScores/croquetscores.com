import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { addTeamPlayer, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(
    `${READER} adds the player "([^"]*)" to the team "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    player: string,
    team: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTeamPlayer(
      this,
      account,
      tournamentNamed(this, name),
      team,
      player,
    );
  },
);

When(
  new RegExp(
    `${READER} adds the player "([^"]*)" to a team "([^"]*)" does not have$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    player: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTeamPlayer(
      this,
      account,
      tournamentNamed(this, name),
      undefined,
      player,
    );
  },
);

When(
  new RegExp(
    `${READER} adds the player "([^"]*)" to the team "([^"]*)" of a tournament there is not$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    player: string,
    team: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTeamPlayer(this, account, noTournament(), team, player);
  },
);
