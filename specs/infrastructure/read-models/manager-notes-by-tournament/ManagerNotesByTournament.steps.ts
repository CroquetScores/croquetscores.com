import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AggregateRepository } from "../../../../src/application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../../../../src/application/common/ProjectingEventStore.js";
import type { ManagerNoteHeading } from "../../../../src/application/operations/tournaments/managerNoteOperations.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { nameManagerNoteEvents } from "../../../../src/domain/aggregates/tournaments/manager-notes/events/managerNoteEvents.js";
import { ManagerNote } from "../../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { ManagerNoteDescription } from "../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import { EventRegistry } from "../../../../src/domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { PostgresEventStore } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import { ManagerNotesByTournament } from "../../../../src/infrastructure/read-models/ManagerNotesByTournament.js";
import type { SpecWorld } from "../../../support/world.js";
import { rebuildsWith } from "../../support/projections.js";
import { rebuildFromEvents } from "../../support/rebuild.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// The read model in front of the Postgres store, with the notes the scenario
// names kept through it as the application keeps them. A tournament is named
// and never made: the read model knows a tournament only by the id a note
// names, so each name the scenario says is given an id of its own.

interface Scenario {
  readonly readModel: ManagerNotesByTournament;
  readonly store: PostgresEventStore;
  readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>;
  readonly tournaments: Map<string, TournamentId>;
  // Each note by the title it was added with, edited or not.
  readonly byTitle: Map<string, ManagerNoteId>;
  found: readonly ManagerNoteHeading[];
  // The note found at a slug, by its id, or nothing where none was.
  foundAt: string | undefined;
  slugs: readonly string[];
  // Whether a rebuild takes the notes' streams the latest added first.
  latestFirst: boolean;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  const scenario = scenarios.get(world);
  assert.ok(scenario !== undefined, "No read model has been stood up.");
  return scenario;
};

// Whoever writes the notes, which the read model says nothing of.
const WRITER = AccountId.from("account/123e4567-e89b-42d3-a456-426614174000");

const now = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const tournamentCalled = (world: SpecWorld, name: string): TournamentId => {
  const { tournaments } = scenarioOf(world);
  const id = tournaments.get(name) ?? TournamentId.create();
  tournaments.set(name, id);
  return id;
};

const noteTitled = (world: SpecWorld, title: string): ManagerNoteId => {
  const id = scenarioOf(world).byTitle.get(title);
  assert.ok(id !== undefined, `No note has been called ${title}.`);
  return id;
};

Given("the manager notes by tournament read model", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  const readModel = new ManagerNotesByTournament(unitOfWork);
  const store = new PostgresEventStore(
    unitOfWork,
    nameManagerNoteEvents(new EventRegistry()),
  );
  const projecting = new ProjectingEventStore(store, [readModel]);
  scenarios.set(this, {
    readModel,
    store,
    notes: new AggregateRepository(projecting, (id, events) =>
      ManagerNote.rebuiltFrom(id, events),
    ),
    tournaments: new Map(),
    byTitle: new Map(),
    found: [],
    foundAt: undefined,
    slugs: [],
    latestFirst: false,
  });
  rebuildsWith(this, () =>
    this.asARequest(async () => {
      const scenario = scenarioOf(this);
      const read = await store.readAll();
      // The store reads them by their ids, which says nothing of when each
      // was added, so the order a scenario names is put on them here.
      const added = [...scenario.byTitle.values()].map((id) => id.value);
      await rebuildFromEvents(
        readModel,
        scenario.latestFirst
          ? [...read].sort(
              (one, other) =>
                added.indexOf(other.stream) - added.indexOf(one.stream),
            )
          : read,
      );
    }),
  );
});

const add = async (
  world: SpecWorld,
  title: string,
  name: string,
  id: ManagerNoteId,
): Promise<void> => {
  const scenario = scenarioOf(world);
  const tournament = tournamentCalled(world, name);
  await world.asARequest(async () =>
    scenario.notes.save(
      ManagerNote.add(
        id,
        tournament,
        ManagerNoteTitle.from(title),
        ManagerNoteDescription.from(""),
        await scenario.readModel.slugsTakenIn(tournament),
        WRITER,
        now(world),
      ),
    ),
  );
  scenario.byTitle.set(title, id);
};

Given(
  "the manager note {string} is added to the tournament {string}",
  async function (this: SpecWorld, title: string, name: string) {
    await add(this, title, name, ManagerNoteId.create());
  },
);

Given(
  "the manager note {string} is added to the tournament {string} as {string}",
  async function (this: SpecWorld, title: string, name: string, id: string) {
    await add(this, title, name, ManagerNoteId.from(id));
  },
);

Given(
  "the notes' streams are to be rebuilt the latest added first",
  function (this: SpecWorld) {
    scenarioOf(this).latestFirst = true;
  },
);

// Done to the note as it is kept, as an operation would.
const doneTo = async (
  world: SpecWorld,
  title: string,
  doing: (note: ManagerNote) => void,
): Promise<void> => {
  const { notes } = scenarioOf(world);
  const id = noteTitled(world, title);
  await world.asARequest(async () => {
    const note = await notes.load(id);
    assert.ok(note !== undefined, `${title} has no events.`);
    doing(note);
    await notes.save(note);
  });
};

Given(
  "the manager note {string} is edited to {string}",
  async function (this: SpecWorld, title: string, to: string) {
    await doneTo(this, title, (note) => {
      note.edit(ManagerNoteTitle.from(to), note.description, WRITER, now(this));
    });
  },
);

Given(
  "the manager note {string} is deleted",
  async function (this: SpecWorld, title: string) {
    await doneTo(this, title, (note) => {
      note.delete(WRITER, now(this));
    });
  },
);

// The one note the scenario named, its whole stream given to the projection
// again, as rebuilding would give it.
When("the note's events are projected again", async function (this: SpecWorld) {
  const { byTitle, readModel, store } = scenarioOf(this);
  const [id] = new Set(byTitle.values());
  assert.ok(id !== undefined, "No note was added.");
  await this.asARequest(async () =>
    readModel.project(id, 1, await store.getEvents(id)),
  );
});

When(
  "the manager notes of {string} are looked for",
  async function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    scenario.found = await this.asARequest(() =>
      scenario.readModel.of(tournamentCalled(this, name)),
    );
  },
);

// What was found -------------------------------------------------------------------

const places = ["first", "second"];

const foundAt = (world: SpecWorld, which: string): ManagerNoteHeading => {
  const { found } = scenarioOf(world);
  const note = found[places.indexOf(which)];
  assert.ok(
    note !== undefined,
    `The notes found are ${inspect(found.map(({ title }) => title))}.`,
  );
  return note;
};

Then(
  /^the (first|second) manager note found is "(.*)"$/,
  function (this: SpecWorld, which: string, title: string) {
    assert.equal(foundAt(this, which).title, title);
  },
);

Then(
  /^the (first|second) manager note found is known by "(.*)"$/,
  function (this: SpecWorld, which: string, id: string) {
    assert.equal(foundAt(this, which).id, id);
  },
);

Then(
  /^the (first|second) manager note found was written at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    assert.equal(
      foundAt(this, which).writtenAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  /^the (first|second) manager note found last changed at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    assert.equal(
      foundAt(this, which).changedAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  /^the (first|second) manager note found is found at "(.*)"$/,
  function (this: SpecWorld, which: string, slug: string) {
    assert.equal(foundAt(this, which).slug, slug);
  },
);

When(
  "the manager note of {string} at {string} is looked for",
  async function (this: SpecWorld, name: string, slug: string) {
    const scenario = scenarioOf(this);
    scenario.foundAt = await this.asARequest(() =>
      scenario.readModel.noteAt(tournamentCalled(this, name), slug),
    );
  },
);

Then(
  "the manager note {string} is found there",
  function (this: SpecWorld, title: string) {
    assert.equal(scenarioOf(this).foundAt, noteTitled(this, title).value);
  },
);

Then("no manager note is found there", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).foundAt, undefined);
});

When(
  "the slugs taken by the notes of {string} are looked for",
  async function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    scenario.slugs = await this.asARequest(() =>
      scenario.readModel.slugsTakenIn(tournamentCalled(this, name)),
    );
  },
);

Then(
  "{string} is among the slugs taken",
  function (this: SpecWorld, slug: string) {
    assert.ok(
      scenarioOf(this).slugs.includes(slug),
      `The slugs taken are ${inspect(scenarioOf(this).slugs)}.`,
    );
  },
);

Then("no slugs are taken", function (this: SpecWorld) {
  assert.deepEqual(scenarioOf(this).slugs, []);
});

Then("no manager notes are found", function (this: SpecWorld) {
  assert.deepEqual(scenarioOf(this).found, []);
});

Then(
  /^(\d+) manager notes? (?:is|are) found$/,
  function (this: SpecWorld, count: string) {
    assert.equal(scenarioOf(this).found.length, Number(count));
  },
);
