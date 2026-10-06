import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ManagerNoteAdded } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteAdded.js";
import { ManagerNoteDeleted } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteDeleted.js";
import { ManagerNoteEdited } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteEdited.js";
import { ManagerNote } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteDescription } from "../../../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { at, byOf, now } from "../../tournament/aTournament.js";
import {
  ask,
  happened,
  noteIdOf,
  noteOf,
  noteScenarioOf,
  noteTournamentOf,
  rebuild,
} from "./aManagerNote.js";

// What a note's features all say: what its stream already holds, what it is
// asked, and what it is afterwards.

// The stream ----------------------------------------------------------------

Given("the manager note id {string}", function (this: SpecWorld, id: string) {
  noteScenarioOf(this).noteId = id;
});

Given(
  "the manager note is to be added to the tournament {string}",
  function (this: SpecWorld, id: string) {
    noteScenarioOf(this).tournamentId = id;
  },
);

Given(
  "the tournament's other notes are found at {string}",
  function (this: SpecWorld, slug: string) {
    noteScenarioOf(this).taken.push(slug);
  },
);

Given(
  "the tournament's other notes are found at {string} and {string}",
  function (this: SpecWorld, one: string, other: string) {
    noteScenarioOf(this).taken.push(one, other);
  },
);

// Made inside what is asked, so that a title or a description that could
// not be a note's is refused as adding it would be.
const added = (world: SpecWorld, title: string, description: string) =>
  ManagerNote.add(
    noteIdOf(world),
    noteTournamentOf(world),
    ManagerNoteTitle.from(title),
    ManagerNoteDescription.from(description),
    noteScenarioOf(world).taken,
    byOf(world),
    now(world),
  );

Given(
  "a stream where the manager note {string} was added",
  function (this: SpecWorld, title: string) {
    noteScenarioOf(this).stream.push(...added(this, title, "").handOver());
  },
);

Given(
  "a stream where the manager note {string} was added saying {string}",
  function (this: SpecWorld, title: string, description: string) {
    noteScenarioOf(this).stream.push(
      ...added(this, title, description).handOver(),
    );
  },
);

Given(
  "the manager note was edited to {string} saying {string}",
  function (this: SpecWorld, title: string, description: string) {
    happened(this, (note) => {
      note.edit(
        ManagerNoteTitle.from(title),
        ManagerNoteDescription.from(description),
        byOf(this),
        now(this),
      );
    });
  },
);

Given("the manager note was deleted", function (this: SpecWorld) {
  happened(this, (note) => {
    note.delete(byOf(this), now(this));
  });
});

Given(
  "the manager note is rebuilt from its stream",
  function (this: SpecWorld) {
    rebuild(this);
  },
);

// What it is asked ------------------------------------------------------------

const add = (world: SpecWorld, title: string, description: string): void => {
  try {
    world.aggregate = added(world, title, description);
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the manager note {string} is added",
  function (this: SpecWorld, title: string) {
    add(this, title, "");
  },
);

When(
  "the manager note {string} is added saying {string}",
  function (this: SpecWorld, title: string, description: string) {
    add(this, title, description);
  },
);

When(
  "the manager note is edited to {string} saying {string}",
  function (this: SpecWorld, title: string, description: string) {
    ask(this, (note) => {
      note.edit(
        ManagerNoteTitle.from(title),
        ManagerNoteDescription.from(description),
        byOf(this),
        now(this),
      );
    });
  },
);

When("the manager note is deleted", function (this: SpecWorld) {
  ask(this, (note) => {
    note.delete(byOf(this), now(this));
  });
});

// What it recorded, and what it is ---------------------------------------------

const assertFirstRecorded = (
  world: SpecWorld,
  kind: abstract new (...args: never[]) => DomainEvent,
): void => {
  const first = noteOf(world).recorded[0];
  assert.ok(first instanceof kind, `It first recorded ${inspect(first)}.`);
};

Then(
  "the first thing it recorded is a manager's note being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ManagerNoteAdded);
  },
);

Then(
  "the first thing it recorded is a manager's note being edited",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ManagerNoteEdited);
  },
);

Then(
  "the first thing it recorded is a manager's note being deleted",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ManagerNoteDeleted);
  },
);

Then(
  "the manager note is known by {string}",
  function (this: SpecWorld, id: string) {
    assert.equal(noteOf(this).id.value, id);
  },
);

Then(
  "the manager note is of the tournament {string}",
  function (this: SpecWorld, id: string) {
    assert.equal(noteOf(this).tournament.value, id);
  },
);

Then(
  "the manager note is found at {string}",
  function (this: SpecWorld, slug: string) {
    assert.equal(noteOf(this).slug.toString(), slug);
  },
);

Then(
  "the manager note is called {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(noteOf(this).title.toString(), title);
  },
);

Then(
  "the manager note says {string}",
  function (this: SpecWorld, description: string) {
    assert.equal(noteOf(this).description?.toString(), description);
  },
);

Then("the manager note says nothing more", function (this: SpecWorld) {
  assert.equal(noteOf(this).description, undefined);
});

Then(
  "the manager note was written at {string}",
  function (this: SpecWorld, moment: string) {
    assert.ok(noteOf(this).writtenAt.equals(at(moment)));
  },
);

Then("the manager note has never been edited", function (this: SpecWorld) {
  assert.equal(noteOf(this).lastEditedAt, undefined);
});

Then(
  "the manager note was last edited at {string}",
  function (this: SpecWorld, moment: string) {
    const { lastEditedAt } = noteOf(this);
    assert.ok(
      lastEditedAt?.equals(at(moment)) === true,
      `It was last edited at ${String(lastEditedAt)}.`,
    );
  },
);

Then(
  /^the manager note has (not )?been deleted$/,
  function (this: SpecWorld, not: string | null) {
    assert.equal(noteOf(this).deleted, not === null);
  },
);
