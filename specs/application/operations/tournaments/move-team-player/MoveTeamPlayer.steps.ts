import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { moveTeamPlayer, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(
    `${READER} moves the player "([^"]*)" of the team "([^"]*)" of "([^"]*)" (up|down|"[^"]*")$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    player: string,
    team: string,
    name: string,
    direction: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeamPlayer(
      this,
      account,
      tournamentNamed(this, name),
      team,
      player,
      direction.replaceAll('"', ""),
    );
  },
);

When(
  new RegExp(
    `${READER} moves a player the team "([^"]*)" of "([^"]*)" does not have up$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    team: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeamPlayer(
      this,
      account,
      tournamentNamed(this, name),
      team,
      undefined,
      "up",
    );
  },
);

When(
  new RegExp(
    `${READER} moves the player "([^"]*)" of the team "([^"]*)" of a tournament there is not up$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    player: string,
    team: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeamPlayer(this, account, noTournament(), team, player, "up");
  },
);
