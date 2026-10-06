import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddManagerNote } from "../../../../../src/application/operations/tournaments/AddManagerNote.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  inHandOf,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";
import { toBeAsked } from "../askedAtOnce.js";
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

// Asked for with another at once (askedAtOnce.ts), its answer kept there.
Given(
  "the reader signed in to the account for {string} is to add the manager note {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    toBeAsked(this, () =>
      inHandOf(this).send(
        new AddManagerNote(
          account,
          tournament.value,
          title,
          descriptionOf(this),
          momentOf(this),
        ),
      ),
    );
  },
);

// Whichever note it is, where two were added at once and which came first is
// not the scenario's to say.
Then(
  "a manager note of {string} is found at {string}",
  async function (this: SpecWorld, name: string, slug: string) {
    const notes = await inHandOf(this).managerNotesOf(
      tournamentNamed(this, name),
    );
    assert.ok(
      notes.some((note) => note.slug === slug),
      `No note is found at ${slug}: ${inspect(notes.map((note) => note.slug))}.`,
    );
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
