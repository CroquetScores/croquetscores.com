import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { accountFor, noTournament, tournamentNamed } from "../aRequest.js";
import { changeTeamPlayerWorldRankingName } from "../teamRequests.js";

When(
  "the reader signed in to the account for {string} changes the world ranking name of the player {string} of the team {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
    worldRankingName: string,
  ) {
    await changeTeamPlayerWorldRankingName(
      this,
      (await accountFor(this, address)).value,
      tournamentNamed(this, name),
      team,
      player,
      worldRankingName,
    );
  },
);

When(
  "the reader signed in to the account for {string} changes the world ranking name of the player {string} of the team {string} of a tournament there is not to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    worldRankingName: string,
  ) {
    await changeTeamPlayerWorldRankingName(
      this,
      (await accountFor(this, address)).value,
      noTournament(),
      team,
      player,
      worldRankingName,
    );
  },
);
