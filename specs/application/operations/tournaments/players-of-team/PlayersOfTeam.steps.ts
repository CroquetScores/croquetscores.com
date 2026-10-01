import { When } from "@cucumber/cucumber";

import { PlayersOfTeam } from "../../../../../src/application/operations/tournaments/PlayersOfTeam.js";
import type { SpecWorld } from "../../../../support/world.js";
import { ask, noTournament, tournamentNamed } from "../aRequest.js";
import { readerOf, teamIn } from "../teamRequests.js";

// What the list answers is read by the steps a tournament's players are read
// by (`PlayersOfTournament.feature`), since a team's player is answered with
// what those steps ask: a name, whether they are archived and whether they
// have played.

const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(`${READER} lists the players of the team "([^"]*)" of "([^"]*)"$`),
  async function (
    this: SpecWorld,
    address: string | undefined,
    team: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await ask(
      this,
      new PlayersOfTeam(
        await readerOf(this, address ?? undefined),
        tournament.value,
        (await teamIn(this, tournament, team)).value,
      ),
    );
  },
);

When(
  new RegExp(`${READER} lists the players of a team "([^"]*)" does not have$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    const tournament = tournamentNamed(this, name);
    await ask(
      this,
      new PlayersOfTeam(
        await readerOf(this, address ?? undefined),
        tournament.value,
        (await teamIn(this, tournament, undefined)).value,
      ),
    );
  },
);

When(
  new RegExp(
    `${READER} lists the players of the team "([^"]*)" of a tournament there is not$`,
  ),
  // The team named is looked for in a tournament there is not, and so names
  // nothing.
  async function (this: SpecWorld, address: string | undefined, team: string) {
    const tournament = noTournament();
    await ask(
      this,
      new PlayersOfTeam(
        await readerOf(this, address ?? undefined),
        tournament.value,
        (await teamIn(this, tournament, team)).value,
      ),
    );
  },
);
