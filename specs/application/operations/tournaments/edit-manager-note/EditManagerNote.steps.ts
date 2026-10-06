import { When } from "@cucumber/cucumber";

import { EditManagerNote } from "../../../../../src/application/operations/tournaments/EditManagerNote.js";
import { ManagerNoteId } from "../../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
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
import {
  managerNoteCalled,
  saidDescription,
  managerNoteCalledOnceOrNow,
} from "../managerNoteRequests.js";

// The note called `title` given the title `to`, and what the scenario said it
// is to say, or what it says already where the scenario said nothing.
const editNote = async (
  world: SpecWorld,
  account: string,
  name: string,
  title: string,
  to: string,
): Promise<void> => {
  const tournament = tournamentNamed(world, name);
  const note = await managerNoteCalledOnceOrNow(world, tournament, title);
  await send(
    world,
    new EditManagerNote(
      account,
      tournament.value,
      note.id.value,
      to,
      saidDescription(world) ?? note.description?.toString() ?? "",
      momentOf(world),
    ),
    tournament,
  );
};

const editNoNote = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
): Promise<void> => {
  await send(
    world,
    new EditManagerNote(
      account,
      tournament.value,
      ManagerNoteId.create().value,
      "Lunch",
      "",
      momentOf(world),
    ),
    tournament,
  );
};

When(
  "the reader signed in to the account for {string} edits the manager note {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
    to: string,
  ) {
    const account = (await accountFor(this, address)).value;
    await editNote(this, account, name, title, to);
  },
);

When(
  "the reader signed in to that account edits the manager note {string} of {string} to {string}",
  async function (this: SpecWorld, title: string, name: string, to: string) {
    await editNote(this, heldAccount(this), name, title, to);
  },
);

When(
  "the reader signed in to the account for {string} edits a manager note {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await editNoNote(this, account, tournamentNamed(this, name));
  },
);

When(
  "the reader signed in to the account for {string} edits a manager note of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await editNoNote(this, account, noTournament());
  },
);

// Another tournament's note, by its id, asked to be edited as one of the
// tournament named.
When(
  "the reader signed in to the account for {string} edits the manager note {string} of {string} as a note of {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    of: string,
    as: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const note = await managerNoteCalled(
      this,
      tournamentNamed(this, of),
      title,
    );
    const tournament = tournamentNamed(this, as);
    await send(
      this,
      new EditManagerNote(
        account,
        tournament.value,
        note.id.value,
        "Tea moved",
        "",
        momentOf(this),
      ),
      tournament,
    );
  },
);
