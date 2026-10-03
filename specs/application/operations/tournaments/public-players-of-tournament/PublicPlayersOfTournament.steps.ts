import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  PublicPlayersOfTournament,
  type TournamentPlayersToRead,
} from "../../../../../src/application/operations/tournaments/PublicPlayersOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the players answered are, and what the tournament is answered as, are
// said in the words the managers' list of players and a tournament's games
// share (PlayersOfTournament.steps.ts, GamesOfTournament.steps.ts). What is
// here is asking, and where each player's page is found.

// Asked with nobody signed in.
const ask = async (
  world: SpecWorld,
  website: string,
  address: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new PublicPlayersOfTournament(website, address),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the public players of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await ask(this, "croquetscores.com", address);
  },
);

When(
  "the public players of the tournament on {string} at {string} are asked for",
  async function (this: SpecWorld, website: string, address: string) {
    await ask(this, website, address);
  },
);

Then(
  "the player {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(
      this.failure,
      undefined,
      `It was refused: ${inspect(this.failure)}`,
    );
    const found = (this.answer as TournamentPlayersToRead).players.find(
      (player) => player.name === name,
    );
    assert.ok(found !== undefined, `${name} is not answered.`);
    assert.equal(found.address, address);
  },
);
