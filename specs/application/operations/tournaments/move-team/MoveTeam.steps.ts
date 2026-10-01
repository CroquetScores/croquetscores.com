import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { moveTeam, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(
    `${READER} moves the team "([^"]*)" in "([^"]*)" (up|down|"[^"]*")$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    team: string,
    name: string,
    direction: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeam(
      this,
      account,
      tournamentNamed(this, name),
      team,
      direction.replaceAll('"', ""),
    );
  },
);

When(
  new RegExp(`${READER} moves a team "([^"]*)" does not have up$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeam(this, account, tournamentNamed(this, name), undefined, "up");
  },
);

When(
  new RegExp(
    `${READER} moves the team "([^"]*)" in a tournament there is not up$`,
  ),
  async function (this: SpecWorld, address: string | undefined, team: string) {
    const account = await readerOf(this, address ?? undefined);
    await moveTeam(this, account, noTournament(), team, "up");
  },
);
