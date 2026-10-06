import { When } from "@cucumber/cucumber";

import { ManagerNoteToEdit } from "../../../../../src/application/operations/tournaments/ManagerNoteToEdit.js";
import { ManagerNoteId } from "../../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";
import { managerNoteCalledOnceOrNow } from "../managerNoteRequests.js";

// The note called `title` of the tournament `of`, deleted or not, asked for
// as one of the tournament `as`, which is the same one but where a scenario
// names another.
const askFor = async (
  world: SpecWorld,
  account: string,
  title: string,
  of: string,
  as: string = of,
): Promise<void> => {
  const note = await managerNoteCalledOnceOrNow(
    world,
    tournamentNamed(world, of),
    title,
  );
  await ask(
    world,
    new ManagerNoteToEdit(
      account,
      tournamentNamed(world, as).value,
      note.id.value,
    ),
  );
};

When(
  "the reader signed in to the account for {string} asks for the manager note {string} of {string} to edit",
  async function (this: SpecWorld, address: string, title: string, of: string) {
    await askFor(this, (await accountFor(this, address)).value, title, of);
  },
);

When(
  "the reader signed in to that account asks for the manager note {string} of {string} to edit",
  async function (this: SpecWorld, title: string, of: string) {
    await askFor(this, heldAccount(this), title, of);
  },
);

When(
  "the reader signed in to the account for {string} asks for the manager note {string} of {string} as a note of {string} to edit",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    of: string,
    as: string,
  ) {
    await askFor(this, (await accountFor(this, address)).value, title, of, as);
  },
);

When(
  "the reader signed in to the account for {string} asks for a manager note {string} does not have to edit",
  async function (this: SpecWorld, address: string, name: string) {
    await ask(
      this,
      new ManagerNoteToEdit(
        (await accountFor(this, address)).value,
        tournamentNamed(this, name).value,
        ManagerNoteId.create().value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} asks for a manager note of a tournament there is not to edit",
  async function (this: SpecWorld, address: string) {
    await ask(
      this,
      new ManagerNoteToEdit(
        (await accountFor(this, address)).value,
        noTournament().value,
        ManagerNoteId.create().value,
      ),
    );
  },
);
