import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddManagerNote } from "../../../../src/application/operations/tournaments/AddManagerNote.js";
import { DeleteManagerNote } from "../../../../src/application/operations/tournaments/DeleteManagerNote.js";
import { EditManagerNote } from "../../../../src/application/operations/tournaments/EditManagerNote.js";
import type { ManagerNoteChanged } from "../../../../src/application/operations/tournaments/tournamentForReaders.js";
import { ManagerNote } from "../../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import { ManagerNoteDescription } from "../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountFor,
  inHandOf,
  load,
  lookAt,
  momentOf,
  tournamentNamed,
} from "./aRequest.js";
import {
  descriptionOf,
  managerNoteCalled,
  managerNoteCalledOnceOrNow,
  rememberDeleted,
  saidDescription,
  toSay,
} from "./managerNoteRequests.js";

// The steps more than one of the features of a tournament's notes uses: what
// the next note is to say, what was done to the notes before the request the
// scenario is about, and what an answer says of them. Each is done as the
// account for an address, and so as whoever that account is to the
// tournament.

Given(
  "the manager note is to say {string}",
  function (this: SpecWorld, description: string) {
    toSay(this, description);
  },
);

Given(
  "the manager note is to say {int} characters",
  function (this: SpecWorld, length: number) {
    toSay(this, "n".repeat(length));
  },
);

Given(
  "{string} has added the manager note {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    await inHandOf(this).send(
      new AddManagerNote(
        account,
        tournament.value,
        title,
        descriptionOf(this),
        momentOf(this),
      ),
    );
    await lookAt(this, tournament);
  },
);

// Under an id the scenario names, so that it can say where the note's page is
// found. Adding a note mints its own id, so the note is made as adding it
// makes it, once the tournament has said the account may, and kept.
Given(
  "{string} has added the manager note {string} to {string} as {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
    id: string,
  ) {
    const account = await accountFor(this, address);
    const tournamentId = tournamentNamed(this, name);
    (await load(this, tournamentId)).allowWritingManagerNotes(account);
    await inHandOf(this).saveManagerNote(
      ManagerNote.add(
        ManagerNoteId.from(id),
        tournamentId,
        ManagerNoteTitle.from(title),
        ManagerNoteDescription.from(descriptionOf(this)),
        account,
        momentOf(this),
      ),
    );
    await lookAt(this, tournamentId);
  },
);

Given(
  "{string} has edited the manager note {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
    to: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    const note = await managerNoteCalled(this, tournament, title);
    await inHandOf(this).send(
      new EditManagerNote(
        account,
        tournament.value,
        note.id.value,
        to,
        saidDescription(this) ?? note.description?.toString() ?? "",
        momentOf(this),
      ),
    );
    await lookAt(this, tournament);
  },
);

Given(
  "{string} has deleted the manager note {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    const note = await managerNoteCalled(this, tournament, title);
    rememberDeleted(this, note);
    await inHandOf(this).send(
      new DeleteManagerNote(
        account,
        tournament.value,
        note.id.value,
        momentOf(this),
      ),
    );
    await lookAt(this, tournament);
  },
);

// What an answer says of the notes ---------------------------------------------

// The notes answered, once the answer was not refused: either a manager's
// list, which is nothing but its notes, or a page's, which answers its
// tournament's notes beside the rest of it.
interface NoteAnswered {
  readonly id: string;
  readonly title: string;
  readonly description?: string | undefined;
  readonly address?: string;
  readonly writtenAt: ReadOnlyDate;
  readonly lastEditedAt?: ReadOnlyDate | undefined;
  readonly changedAt?: ReadOnlyDate;
}

const answer = (world: SpecWorld): unknown => {
  assert.equal(
    world.failure,
    undefined,
    `It was refused: ${inspect(world.failure)}`,
  );
  return world.answer;
};

const notesAnswered = (world: SpecWorld): readonly NoteAnswered[] => {
  const answered = answer(world);
  return Array.isArray(answered)
    ? (answered as readonly NoteAnswered[])
    : (answered as { managerNotes: readonly NoteAnswered[] }).managerNotes;
};

const places = ["first", "second"];

const noteAnsweredAt = (world: SpecWorld, which: string): NoteAnswered => {
  const notes = notesAnswered(world);
  const found = notes[places.indexOf(which)];
  assert.ok(
    found !== undefined,
    `The notes answered are ${inspect(notes.map(({ title }) => title))}.`,
  );
  return found;
};

const isAt = (date: ReadOnlyDate | undefined, moment: string): void => {
  assert.equal(date?.toISOString(), new Date(moment).toISOString());
};

Then("no manager notes are answered", function (this: SpecWorld) {
  assert.deepEqual(notesAnswered(this), []);
});

Then(
  /^the (first|second) manager note answered is "(.*)"$/,
  function (this: SpecWorld, which: string, title: string) {
    assert.equal(noteAnsweredAt(this, which).title, title);
  },
);

Then(
  /^the (first|second) manager note answered says "(.*)"$/,
  function (this: SpecWorld, which: string, description: string) {
    assert.equal(noteAnsweredAt(this, which).description, description);
  },
);

Then(
  /^the (first|second) manager note answered says nothing more$/,
  function (this: SpecWorld, which: string) {
    assert.equal(noteAnsweredAt(this, which).description, undefined);
  },
);

Then(
  /^the (first|second) manager note answered was written at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    isAt(noteAnsweredAt(this, which).writtenAt, moment);
  },
);

Then(
  /^the (first|second) manager note answered has never been edited$/,
  function (this: SpecWorld, which: string) {
    assert.equal(noteAnsweredAt(this, which).lastEditedAt, undefined);
  },
);

Then(
  /^the (first|second) manager note answered was last edited at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    isAt(noteAnsweredAt(this, which).lastEditedAt, moment);
  },
);

Then(
  /^the (first|second) manager note answered is found at "(.*)"$/,
  function (this: SpecWorld, which: string, address: string) {
    assert.equal(noteAnsweredAt(this, which).address, address);
  },
);

Then(
  /^the (first|second) manager note answered last changed at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    isAt(noteAnsweredAt(this, which).changedAt, moment);
  },
);

// Every page of a tournament answers each of its notes with when it last
// changed, for its section bar (notes.feature).
Then(
  /^the (first|second) manager note of the tournament answered last changed at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    const notes = (
      answer(this) as { managerNotes: readonly ManagerNoteChanged[] }
    ).managerNotes;
    isAt(notes[places.indexOf(which)]?.changedAt, moment);
  },
);

// Found among the notes of the tournament the scenario is looking at, which
// is the one the note was added to.
Then(
  "it is answered with the id of the tournament's manager note {string}",
  async function (this: SpecWorld, title: string) {
    const looking = this.aggregate as { id: TournamentId } | undefined;
    assert.ok(looking !== undefined, "No tournament is being looked at.");
    const note = await managerNoteCalled(this, looking.id, title);
    assert.ok(
      note.id.equals(this.answer as ManagerNoteId),
      `It was answered with ${String(this.answer)}.`,
    );
  },
);

// What the notes are kept as, which the browser's features say in the same
// words: a note is kept by itself, so each is asked of the read model of a
// tournament's notes and of the note's own stream. Asked again for a while,
// since a browser's request may still be on its way when the step is reached.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

Then(
  "{string} has the manager note {string}",
  async function (this: SpecWorld, name: string, title: string) {
    await eventually(async () => {
      await managerNoteCalled(this, tournamentNamed(this, name), title);
    });
  },
);

Then(
  "{string} has no manager notes",
  async function (this: SpecWorld, name: string) {
    await eventually(async () => {
      const notes = await inHandOf(this).managerNotesOf(
        tournamentNamed(this, name),
      );
      assert.deepEqual(notes, []);
    });
  },
);

const keptDescription = async (
  world: SpecWorld,
  title: string,
  name: string,
): Promise<string | undefined> =>
  (
    await managerNoteCalled(world, tournamentNamed(world, name), title)
  ).description?.toString();

Then(
  "the manager note {string} of {string} says {string}",
  async function (this: SpecWorld, title: string, name: string, said: string) {
    await eventually(async () => {
      assert.equal(await keptDescription(this, title, name), said);
    });
  },
);

Then(
  "the manager note {string} of {string} says nothing more",
  async function (this: SpecWorld, title: string, name: string) {
    await eventually(async () => {
      assert.equal(await keptDescription(this, title, name), undefined);
    });
  },
);

// Who caused what the note last recorded, as its own stream says.
const lastCausedBy = async (
  world: SpecWorld,
  note: ManagerNote,
): Promise<string | undefined> =>
  (await inHandOf(world).eventsOf(note.id)).at(-1)?.createdBy.value;

Then(
  /^the manager note "(.*)" of "(.*)" was (added|last edited|deleted) by the account for "(.*)"$/,
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    done: string,
    address: string,
  ) {
    const note = await managerNoteCalledOnceOrNow(
      this,
      tournamentNamed(this, name),
      title,
    );
    const events = await inHandOf(this).eventsOf(note.id);
    const caused =
      done === "added"
        ? events[0]?.createdBy.value
        : await lastCausedBy(this, note);
    assert.equal(caused, (await accountFor(this, address)).value);
  },
);
