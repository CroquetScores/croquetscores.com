import { When } from "@cucumber/cucumber";

import { PublicManagerNotesOfTournament } from "../../../../../src/application/operations/tournaments/PublicManagerNotesOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { ask } from "../aRequest.js";

// Asked with nobody signed in, since a tournament's notes are for anybody.
When(
  "the public manager notes of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await ask(
      this,
      new PublicManagerNotesOfTournament("croquetscores.com", address),
    );
  },
);

When(
  "the public manager notes of the tournament on {string} at {string} are asked for",
  async function (this: SpecWorld, website: string, address: string) {
    await ask(this, new PublicManagerNotesOfTournament(website, address));
  },
);
