import { When } from "@cucumber/cucumber";

import { ManagerNotesOfTournament } from "../../../../../src/application/operations/tournaments/ManagerNotesOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

When(
  "the reader signed in to the account for {string} lists the manager notes of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new ManagerNotesOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the manager notes of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new ManagerNotesOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the manager notes of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new ManagerNotesOfTournament(account, noTournament().value),
    );
  },
);
