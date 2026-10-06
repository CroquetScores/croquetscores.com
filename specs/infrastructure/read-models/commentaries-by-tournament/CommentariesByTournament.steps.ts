import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type {
  CommentaryChanged,
  CommentaryListed,
} from "../../../../src/application/operations/tournaments/tournamentForReaders.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../../../src/domain/aggregates/accounts/events/AccountForgotten.js";
import { nameAccountEvents } from "../../../../src/domain/aggregates/accounts/events/accountEvents.js";
import { CommentaryCommentAdded } from "../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { nameCommentaryEvents } from "../../../../src/domain/aggregates/tournaments/commentaries/events/commentaryEvents.js";
import { CommentId } from "../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentaryStarted } from "../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryStarted.js";
import { CommentaryTitleChanged } from "../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryTitleChanged.js";
import { CommentaryId } from "../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../../../src/domain/common/EventRegistry.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import {
  PostgresEventStore,
  type StoredEvent,
} from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import { CommentariesByTournament } from "../../../../src/infrastructure/read-models/CommentariesByTournament.js";
import { ProjectingEventStore } from "../../../../src/application/common/ProjectingEventStore.js";
import type { SpecWorld } from "../../../support/world.js";
import { rebuildsWith } from "../../support/projections.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// The read model in front of the Postgres store, and the events the scenario
// says happened appended through it to the streams they belong to: a
// commentary's start and its comments to its own, and a forgetting to the
// account's. The events are made as their aggregates would
// make them, rather than through the aggregates, since the read model is told
// only of the events, and a tournament made to start a commentary would say
// nothing the read model reads besides.

interface Scenario {
  readonly readModel: CommentariesByTournament;
  readonly store: PostgresEventStore;
  readonly projecting: ProjectingEventStore;
  readonly tournaments: Map<string, TournamentId>;
  readonly commentaries: Map<string, CommentaryId>;
  readonly comments: Map<string, CommentId>;
  // How many events each stream holds, for the next append to expect.
  readonly versions: Map<string, number>;
  // Which kind of stream a rebuild takes first, where the scenario says, and
  // whether it takes the commentaries' streams the latest started first.
  first: "account/" | undefined;
  latestFirst: boolean;
  // The commentaries' streams, in the order they were started.
  readonly started: string[];
  found: readonly CommentaryListed[];
  changed: readonly CommentaryChanged[];
  foundAt: string | undefined;
  taken: {
    readonly titles: readonly string[];
    readonly slugs: readonly string[];
  };
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  const scenario = scenarios.get(world);
  assert.ok(scenario !== undefined, "No read model has been stood up.");
  return scenario;
};

const now = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// Whoever writes, where nothing turns on it.
const WRITER = AccountId.from("account/123e4567-e89b-42d3-a456-426614174000");

const tournamentCalled = (world: SpecWorld, name: string): TournamentId => {
  const { tournaments } = scenarioOf(world);
  const id = tournaments.get(name) ?? TournamentId.create();
  tournaments.set(name, id);
  return id;
};

const commentaryCalled = (world: SpecWorld, title: string): CommentaryId => {
  const id = scenarioOf(world).commentaries.get(title);
  assert.ok(id !== undefined, `No commentary has been called ${title}.`);
  return id;
};

const appended = async (
  world: SpecWorld,
  stream: Id,
  event: DomainEvent,
): Promise<void> => {
  const { projecting, versions } = scenarioOf(world);
  const version = versions.get(stream.value) ?? 0;
  await world.asARequest(() =>
    projecting.appendEvents(stream, version, [event]),
  );
  versions.set(stream.value, version + 1);
};

Given("the commentaries by tournament read model", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  const readModel = new CommentariesByTournament(unitOfWork);
  const store = new PostgresEventStore(
    unitOfWork,
    nameCommentaryEvents(nameAccountEvents(new EventRegistry())),
  );
  const scenario: Scenario = {
    readModel,
    store,
    projecting: new ProjectingEventStore(store, [readModel]),
    tournaments: new Map(),
    commentaries: new Map(),
    comments: new Map(),
    versions: new Map(),
    first: undefined,
    latestFirst: false,
    started: [],
    found: [],
    changed: [],
    foundAt: undefined,
    taken: { titles: [], slugs: [] },
  };
  scenarios.set(this, scenario);
  rebuildsWith(this, () =>
    this.asARequest(async () => {
      const read = await store.readAll();
      // The store reads them by their ids, which says nothing of when each
      // was started, so the order a scenario names is put on them here.
      const startedAt = (stream: string): number =>
        scenario.started.indexOf(stream);
      const events = scenario.latestFirst
        ? [...read].sort(
            (one, other) => startedAt(other.stream) - startedAt(one.stream),
          )
        : read;
      const isFirst = ({ stream }: StoredEvent): boolean =>
        scenario.first !== undefined && stream.startsWith(scenario.first);
      await readModel.rebuildFrom(
        scenario.first === undefined
          ? events
          : [
              ...events.filter(isFirst),
              ...events.filter((each) => !isFirst(each)),
            ],
      );
    }),
  );
});

// The slug a commentary's start gives it, where nothing else has it.
const slugOf = (title: string): string =>
  title.toLowerCase().replaceAll(" ", "-");

// That the commentary `title` is started, and known by that title to the
// scenario from then on.
const started = async (
  world: SpecWorld,
  title: string,
  name: string,
  writer: string,
  slug: string,
): Promise<void> => {
  const id = CommentaryId.create();
  const scenario = scenarioOf(world);
  scenario.commentaries.set(title, id);
  scenario.started.push(id.value);
  await appended(
    world,
    id,
    new CommentaryStarted(
      tournamentCalled(world, name).value,
      title,
      slug,
      writer,
      AccountId.from(writer),
      now(world),
    ),
  );
};

Given(
  "the commentary {string} is started on the tournament {string} by {string}",
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    writer: string,
  ) {
    await started(this, title, name, writer, slugOf(title));
  },
);

// A second commentary with a title another had, found at a slug of its own,
// since the first keeps the slug it was found at when its title changes.
Given(
  "the commentary {string} is started again on the tournament {string}, found at {string}",
  async function (this: SpecWorld, title: string, name: string, slug: string) {
    await started(this, title, name, WRITER.value, slug);
  },
);

Given(
  "the comment {string} is added to {string}",
  async function (this: SpecWorld, text: string, title: string) {
    const id = CommentId.create();
    scenarioOf(this).comments.set(text, id);
    await appended(
      this,
      commentaryCalled(this, title),
      new CommentaryCommentAdded(id.value, text, WRITER, now(this)),
    );
  },
);

const commentSaid = (world: SpecWorld, text: string): CommentId => {
  const id = scenarioOf(world).comments.get(text);
  assert.ok(id !== undefined, `No comment has said ${text}.`);
  return id;
};

Given(
  "the comment {string} in {string} is edited to {string}",
  async function (this: SpecWorld, text: string, title: string, to: string) {
    await appended(
      this,
      commentaryCalled(this, title),
      new CommentaryCommentEdited(
        commentSaid(this, text).value,
        to,
        WRITER,
        now(this),
      ),
    );
  },
);

Given(
  "the comment {string} in {string} is deleted",
  async function (this: SpecWorld, text: string, title: string) {
    await appended(
      this,
      commentaryCalled(this, title),
      new CommentaryCommentDeleted(
        commentSaid(this, text).value,
        WRITER,
        now(this),
      ),
    );
  },
);

Given(
  "the account {string} is forgotten",
  async function (this: SpecWorld, account: string) {
    const id = AccountId.from(account);
    await appended(this, id, new AccountForgotten(id, now(this)));
  },
);

Given(
  "the title of {string} is changed to {string}",
  async function (this: SpecWorld, title: string, to: string) {
    await appended(
      this,
      commentaryCalled(this, title),
      new CommentaryTitleChanged(to, WRITER, now(this)),
    );
  },
);

Given(
  "the commentaries' streams are to be rebuilt the latest started first",
  function (this: SpecWorld) {
    scenarioOf(this).latestFirst = true;
  },
);

Given(
  "the accounts' streams are to be rebuilt before the commentaries'",
  function (this: SpecWorld) {
    scenarioOf(this).first = "account/";
  },
);

// Every stream the scenario wrote to, its whole stream given to the
// projection again on top of what is there, as running it twice would.
When(
  "every stream's events are projected again",
  async function (this: SpecWorld) {
    const { readModel, store, versions } = scenarioOf(this);
    await this.asARequest(async () => {
      for (const written of versions.keys()) {
        const stream = written.startsWith("commentary/")
          ? CommentaryId.from(written)
          : AccountId.from(written);
        await readModel.project(stream, 1, await store.getEvents(stream));
      }
    });
  },
);

When(
  "the commentaries of {string} are looked for",
  async function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    const tournament = tournamentCalled(this, name);
    scenario.found = await this.asARequest(() =>
      scenario.readModel.listed(tournament),
    );
    scenario.changed = await this.asARequest(() =>
      scenario.readModel.of(tournament),
    );
  },
);

When(
  "the commentary of {string} at {string} is looked for",
  async function (this: SpecWorld, name: string, slug: string) {
    const scenario = scenarioOf(this);
    scenario.foundAt = await this.asARequest(() =>
      scenario.readModel.at(tournamentCalled(this, name), slug),
    );
  },
);

When(
  "the titles and slugs taken by the commentaries of {string} are looked for",
  async function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    scenario.taken = await this.asARequest(() =>
      scenario.readModel.taken(tournamentCalled(this, name)),
    );
  },
);

// What was found -------------------------------------------------------------------

// Among a tournament's commentaries as a reader is shown them, its writer not
// forgotten.
const shownCalled = (
  world: SpecWorld,
  title: string,
): CommentaryChanged | undefined => {
  const id = commentaryCalled(world, title).value;
  return scenarioOf(world).changed.find((each) => each.id === id);
};

const listedCalled = (world: SpecWorld, title: string): CommentaryListed => {
  const id = commentaryCalled(world, title).value;
  const found = scenarioOf(world).found.find((each) => each.id === id);
  assert.ok(found !== undefined, `${title} is not listed.`);
  return found;
};

const places = ["first", "second"];

Then(
  "the commentary {string} is found",
  function (this: SpecWorld, title: string) {
    assert.ok(
      shownCalled(this, title) !== undefined,
      `The commentaries found are ${inspect(scenarioOf(this).changed)}.`,
    );
  },
);

Then(
  /^the (first|second) commentary found is "(.*)"$/,
  function (this: SpecWorld, which: string, title: string) {
    assert.equal(scenarioOf(this).found[places.indexOf(which)]?.title, title);
  },
);

Then(
  /^the (first|second) commentary found last changed at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    assert.equal(
      scenarioOf(this).found[places.indexOf(which)]?.changedAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the commentary {string} found is at {string}",
  function (this: SpecWorld, title: string, slug: string) {
    assert.equal(listedCalled(this, title).slug, slug);
  },
);

Then(
  "the commentary {string} found is written by {string}",
  function (this: SpecWorld, title: string, writer: string) {
    assert.equal(listedCalled(this, title).writer, writer);
  },
);

Then(
  "the commentary {string} found last changed at {string}",
  function (this: SpecWorld, title: string, moment: string) {
    assert.equal(
      shownCalled(this, title)?.changedAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the commentary {string} is found there",
  function (this: SpecWorld, title: string) {
    assert.equal(scenarioOf(this).foundAt, commentaryCalled(this, title).value);
  },
);

Then("no commentary is found there", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).foundAt, undefined);
});

Then(
  "the title {string} is among those taken",
  function (this: SpecWorld, title: string) {
    assert.ok(scenarioOf(this).taken.titles.includes(title));
  },
);

Then(
  "the slug {string} is among those taken",
  function (this: SpecWorld, slug: string) {
    assert.ok(scenarioOf(this).taken.slugs.includes(slug));
  },
);

Then("nothing is taken", function (this: SpecWorld) {
  assert.deepEqual(scenarioOf(this).taken, { titles: [], slugs: [] });
});

Then("no commentaries are found", function (this: SpecWorld) {
  assert.deepEqual(scenarioOf(this).changed, []);
});

Then(
  /^(\d+) commentar(?:y is|ies are) found$/,
  function (this: SpecWorld, count: string) {
    assert.equal(scenarioOf(this).changed.length, Number(count));
  },
);
