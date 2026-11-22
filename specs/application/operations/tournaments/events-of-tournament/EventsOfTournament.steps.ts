import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { EventsOfTournament } from "../../../../../src/application/operations/tournaments/EventsOfTournament.js";
import type { EventsOfTournamentAnswered } from "../../../../../src/application/operations/tournaments/EventsOfTournament.js";
import type { KeptEvent } from "../../../../../src/application/services/TournamentEvents.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  load,
  scenarioOf,
  tournamentNamed,
} from "../aRequest.js";

// Where the tournament is found, as its page is asked for it.
const addressOf = async (world: SpecWorld, name: string): Promise<string> =>
  (await load(world, tournamentNamed(world, name))).address.toString();

When(
  "the reader signed in to the account for {string} reads the events of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new EventsOfTournament(account, await addressOf(this, name)),
    );
  },
);

When(
  "the reader signed in to the account for {string} reads the events of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(this, new EventsOfTournament(account, "2026/ac/there-is-not"));
  },
);

// The events answered, once reading was not refused: a step reading them from
// a refused request would say there are none when the truth is that nobody was
// told.
const wholeAnswer = (world: SpecWorld): EventsOfTournamentAnswered => {
  assert.equal(
    world.failure,
    undefined,
    `Reading was refused: ${String(world.failure)}`,
  );
  return world.answer as EventsOfTournamentAnswered;
};

const answered = (world: SpecWorld): readonly KeptEvent[] =>
  wholeAnswer(world).events;

const kinds = (world: SpecWorld): string[] =>
  answered(world).map(({ kind }) => kind);

const ofKind = (world: SpecWorld, kind: string): KeptEvent => {
  const found = answered(world).find((event) => event.kind === kind);
  assert.ok(
    found !== undefined,
    `The events answered are ${JSON.stringify(kinds(world))}.`,
  );
  return found;
};

Then(
  /^(\d+) events? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).length, Number(count));
  },
);

Then(
  "the first event answered is a {string}",
  function (this: SpecWorld, kind: string) {
    assert.equal(answered(this)[0]?.kind, kind);
  },
);

Then(
  "the last event answered is a {string}",
  function (this: SpecWorld, kind: string) {
    assert.equal(answered(this).at(-1)?.kind, kind);
  },
);

Then(
  "an event answered is a {string}",
  function (this: SpecWorld, kind: string) {
    assert.ok(
      kinds(this).includes(kind),
      `The events answered are ${JSON.stringify(kinds(this))}.`,
    );
  },
);

Then(
  "no event answered is a {string}",
  function (this: SpecWorld, kind: string) {
    assert.ok(
      !kinds(this).includes(kind),
      `The events answered are ${JSON.stringify(kinds(this))}.`,
    );
  },
);

Then(
  "the first event answered happened at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(answered(this)[0]?.happenedAt, new Date(moment).toISOString());
  },
);

Then(
  "the first event answered carried the name {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this)[0]?.carried["name"], name);
  },
);

Then(
  "the first event answered was kept in the tournament's stream",
  function (this: SpecWorld) {
    const { looking } = scenarioOf(this);
    assert.ok(looking !== undefined, "No tournament was looked at.");
    assert.equal(answered(this)[0]?.stream, looking.value);
  },
);

// A stream is named for what it holds, before the id that tells one from
// another: "commentary/0d1e2f3a-…".
const keptInA = (kind: string, stream: string) =>
  function (this: SpecWorld, eventKind: string) {
    assert.ok(
      ofKind(this, eventKind).stream.startsWith(`${stream}/`),
      `The ${kind} event was kept in ${ofKind(this, eventKind).stream}.`,
    );
  };

Then(
  "the event answered that is a {string} was kept in the commentary's stream",
  keptInA("commentary", "commentary"),
);

Then(
  "the event answered that is a {string} was kept in the competition's stream",
  keptInA("competition", "competition"),
);

Then(
  "the event answered that is a {string} comes before the event answered that is a {string}",
  // Said of two events there are: a step before it says so, so that this is
  // only about their order.
  function (this: SpecWorld, sooner: string, later: string) {
    const found = kinds(this);
    assert.ok(
      found.indexOf(sooner) < found.indexOf(later),
      JSON.stringify(found),
    );
  },
);

Then(
  "the events answered are of the tournament called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(wholeAnswer(this).name, name);
  },
);
