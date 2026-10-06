import { When } from "@cucumber/cucumber";

import { AddManagerNote } from "../../../../../src/application/operations/tournaments/AddManagerNote.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";
import { descriptionOf } from "../managerNoteRequests.js";

// Saying what the scenario said the note is to say, if anything.
const addNote = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  title: string,
): Promise<void> => {
  await send(
    world,
    new AddManagerNote(
      account,
      tournament.value,
      title,
      descriptionOf(world),
      momentOf(world),
    ),
    tournament,
  );
};

When(
  "the reader signed in to the account for {string} adds the manager note {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    await addNote(this, account, tournamentNamed(this, name), title);
  },
);

When(
  "the reader signed in to that account adds the manager note {string} to {string}",
  async function (this: SpecWorld, title: string, name: string) {
    await addNote(this, heldAccount(this), tournamentNamed(this, name), title);
  },
);

When(
  "the reader signed in to the account for {string} adds the manager note {string} to a tournament there is not",
  async function (this: SpecWorld, address: string, title: string) {
    const account = (await accountFor(this, address)).value;
    await addNote(this, account, noTournament(), title);
  },
);
