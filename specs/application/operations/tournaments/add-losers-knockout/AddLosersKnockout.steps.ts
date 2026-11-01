import { Given, When } from "@cucumber/cucumber";

import { AddLosersKnockout } from "../../../../../src/application/operations/tournaments/AddLosersKnockout.js";
import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import {
  accountFor,
  inHandOf,
  lookAt,
  momentOf,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { competitionIn } from "../requests.js";
import { send } from "../aRequest.js";

// The command to add `name` to the tournament called `tournamentName`, for the
// losers of the round `ordinal` of its competition `from`.
const adding = async (
  world: SpecWorld,
  address: string,
  name: string,
  tournamentName: string,
  ordinal: string,
  from: string,
): Promise<AddLosersKnockout> => {
  const account = await accountFor(world, address);
  const tournament = tournamentNamed(world, tournamentName);
  return new AddLosersKnockout(
    account.value,
    tournament.value,
    name,
    (await competitionIn(world, tournament, from)).value,
    positionOf(ordinal),
    momentOf(world),
  );
};

Given(
  "{string} has added the losers knockout {string} to {string} for the losers of the {word} round of {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    tournamentName: string,
    ordinal: string,
    from: string,
  ) {
    await inHandOf(this).send(
      await adding(this, address, name, tournamentName, ordinal, from),
    );
    await lookAt(this, tournamentNamed(this, tournamentName));
  },
);

When(
  "the reader signed in to the account for {string} adds the losers knockout {string} to {string} for the losers of the {word} round of {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    tournamentName: string,
    ordinal: string,
    from: string,
  ) {
    await send(
      this,
      await adding(this, address, name, tournamentName, ordinal, from),
      tournamentNamed(this, tournamentName),
    );
  },
);

When(
  "the reader signed in to the account for {string} adds the losers knockout {string} to a tournament there is not",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await accountFor(this, address);
    await send(
      this,
      new AddLosersKnockout(
        account.value,
        noTournament().value,
        name,
        CompetitionId.create().value,
        0,
        momentOf(this),
      ),
      undefined,
    );
  },
);
