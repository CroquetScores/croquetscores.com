import { When } from "@cucumber/cucumber";

import { DeleteManagerNote } from "../../../../../src/application/operations/tournaments/DeleteManagerNote.js";
import { ManagerNoteId } from "../../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  heldAccount,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";
import {
  managerNoteCalledOnceOrNow,
  rememberDeleted,
} from "../managerNoteRequests.js";

const deleteNote = async (
  world: SpecWorld,
  account: string,
  name: string,
  title: string,
): Promise<void> => {
  const tournament = tournamentNamed(world, name);
  const note = await managerNoteCalledOnceOrNow(world, tournament, title);
  rememberDeleted(world, note);
  await send(
    world,
    new DeleteManagerNote(
      account,
      tournament.value,
      note.id.value,
      momentOf(world),
    ),
    tournament,
  );
};

When(
  "the reader signed in to the account for {string} deletes the manager note {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    await deleteNote(this, account, name, title);
  },
);

When(
  "the reader signed in to that account deletes the manager note {string} of {string}",
  async function (this: SpecWorld, title: string, name: string) {
    await deleteNote(this, heldAccount(this), name, title);
  },
);

When(
  "the reader signed in to the account for {string} deletes a manager note of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    const tournament = noTournament();
    await send(
      this,
      new DeleteManagerNote(
        account,
        tournament.value,
        ManagerNoteId.create().value,
        momentOf(this),
      ),
      tournament,
    );
  },
);

When(
  "the reader signed in to the account for {string} deletes a manager note {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    await send(
      this,
      new DeleteManagerNote(
        account,
        tournament.value,
        ManagerNoteId.create().value,
        momentOf(this),
      ),
      tournament,
    );
  },
);
