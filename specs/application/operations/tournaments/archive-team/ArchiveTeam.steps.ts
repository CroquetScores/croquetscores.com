import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { archiveTeam, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(`${READER} archives the team "([^"]*)" in "([^"]*)"$`),
  async function (
    this: SpecWorld,
    address: string | undefined,
    team: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await archiveTeam(this, account, tournamentNamed(this, name), team);
  },
);

When(
  new RegExp(`${READER} archives a team "([^"]*)" does not have$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    const account = await readerOf(this, address ?? undefined);
    await archiveTeam(this, account, tournamentNamed(this, name), undefined);
  },
);

When(
  new RegExp(
    `${READER} archives the team "([^"]*)" in a tournament there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined, team: string) {
    const account = await readerOf(this, address ?? undefined);
    await archiveTeam(this, account, noTournament(), team);
  },
);
