import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ManagerNoteAdded } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteAdded.js";
import { ManagerNoteDeleted } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteDeleted.js";
import { ManagerNoteEdited } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/ManagerNoteEdited.js";
import { nameManagerNoteEvents } from "../../../../../../src/domain/aggregates/tournaments/manager-notes/events/managerNoteEvents.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../../../../../src/domain/common/EventRegistry.js";
import { causedBy, happenedAt } from "../../../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What writing each event down and reading it back asks of the registry is
// the tournament's events' steps' (tournamentEvents.steps.ts): these name a
// note's events, each with something in every field, so that a field dropped
// or read wrongly is found by what is read back.

const TOURNAMENT = "tournament/123e4567-e89b-42d3-a456-426614174000";

const EVENTS: Readonly<Record<string, () => DomainEvent>> = {
  "a manager's note being added": () =>
    new ManagerNoteAdded(
      TOURNAMENT,
      "Lunch",
      "In the **clubhouse**",
      causedBy,
      happenedAt,
    ),
  "a manager's note being edited": () =>
    new ManagerNoteEdited("Lunch moved", "At one", causedBy, happenedAt),
  "a manager's note being deleted": () =>
    new ManagerNoteDeleted(causedBy, happenedAt),
};

// Matched by these happenings alone, so that the steps for the tournament's
// events and the registry's own examples are never matched as well.
const HAPPENINGS = new RegExp(
  `^an event of (${Object.keys(EVENTS)
    .map((happening) => happening.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})$`,
);

Given(
  "a registry that knows a manager's note's events",
  function (this: SpecWorld) {
    this.registry = nameManagerNoteEvents(new EventRegistry());
  },
);

Given(HAPPENINGS, function (this: SpecWorld, happening: string) {
  const make = EVENTS[happening];
  assert.ok(make !== undefined, `There is no event of ${happening}.`);
  this.pendingEvents.push(make());
});
