import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ManagerNote } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import { TournamentId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What the steps for each of a note's features share: the stream a scenario
// says the note already has, and the note rebuilt from it, which is what the
// scenario asks things of. A module rather than a steps file, so that a
// feature's steps can use it without defining a step twice. Who asks and when
// are the tournament's steps', as they are for a commentary.

interface Scenario {
  // The id the scenario says the note is added as, or one made where it says
  // none, and the tournament it is added to, likewise.
  noteId: string | undefined;
  tournamentId: string | undefined;
  readonly stream: DomainEvent[];
  // The slugs the scenario says the tournament's other notes have.
  readonly taken: string[];
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

export const noteScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      noteId: undefined,
      tournamentId: undefined,
      stream: [],
      taken: [],
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// The note's id, the one the scenario said when it said one, and the same one
// every time it is asked.
export const noteIdOf = (world: SpecWorld): ManagerNoteId => {
  const scenario = noteScenarioOf(world);
  scenario.noteId ??= ManagerNoteId.create().value;
  return ManagerNoteId.from(scenario.noteId);
};

// The tournament it is added to, the same one every time it is asked.
export const noteTournamentOf = (world: SpecWorld): TournamentId => {
  const scenario = noteScenarioOf(world);
  scenario.tournamentId ??= TournamentId.create().value;
  return TournamentId.from(scenario.tournamentId);
};

const rebuilt = (world: SpecWorld): ManagerNote =>
  ManagerNote.rebuiltFrom(noteIdOf(world), noteScenarioOf(world).stream);

/** The note rebuilt from its stream, which the scenario looks at next. */
export const rebuild = (world: SpecWorld): void => {
  world.aggregate = rebuilt(world);
};

/**
 * That `happening` happened to the note after everything its stream holds
 * already: done to the note the stream leaves, so that it records what a note
 * would have.
 */
export const happened = (
  world: SpecWorld,
  happening: (note: ManagerNote) => void,
): void => {
  const note = rebuilt(world);
  happening(note);
  noteScenarioOf(world).stream.push(...note.handOver());
};

export const noteOf = (world: SpecWorld): ManagerNote => {
  assert.ok(
    world.aggregate instanceof ManagerNote,
    `There is no note: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// Asking a note something may be refused, and the scenario says whether it
// expects that, so a refusal is kept rather than thrown.
export const ask = (
  world: SpecWorld,
  asking: (note: ManagerNote) => void,
): void => {
  const note = noteOf(world);
  try {
    asking(note);
  } catch (failure) {
    world.failure = failure;
  }
};
