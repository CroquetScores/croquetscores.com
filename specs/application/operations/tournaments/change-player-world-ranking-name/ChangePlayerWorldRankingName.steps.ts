import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { changePlayerWorldRankingName } from "../requests.js";

When(
  "the reader signed in to the account for {string} changes the world ranking name of the player {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
    worldRankingName: string,
  ) {
    await changePlayerWorldRankingName(
      this,
      (await accountFor(this, address)).value,
      tournamentNamed(this, name),
      player,
      worldRankingName,
    );
  },
);

When(
  "the reader signed in to that account changes the world ranking name of the player {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    player: string,
    name: string,
    worldRankingName: string,
  ) {
    await changePlayerWorldRankingName(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      player,
      worldRankingName,
    );
  },
);

When(
  "the reader signed in to the account for {string} changes the world ranking name of the player {string} of a tournament there is not to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    worldRankingName: string,
  ) {
    await changePlayerWorldRankingName(
      this,
      (await accountFor(this, address)).value,
      noTournament(),
      player,
      worldRankingName,
    );
  },
);
