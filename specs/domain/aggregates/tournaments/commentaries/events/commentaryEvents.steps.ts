import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { nameCommentaryEvents } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/commentaryEvents.js";
import { CommentaryCommentAdded } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { CommentaryStarted } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryStarted.js";
import { CommentaryTitleChanged } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryTitleChanged.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../../../../../src/domain/common/EventRegistry.js";
import { causedBy, happenedAt } from "../../../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What writing each event down and reading it back asks of the registry is
// the tournament's events' steps' (tournamentEvents.steps.ts): these name a
// commentary's events, each with something in every field, so that a field
// dropped or read wrongly is found by what is read back.

const WRITER = "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const COMMENT = "comment/123e4567-e89b-42d3-a456-426614174000";
const TOURNAMENT = "tournament/123e4567-e89b-42d3-a456-426614174000";

const EVENTS: Readonly<Record<string, () => DomainEvent>> = {
  // Its own record, not the tournament's starting of it, which is said in
  // words of its own so that neither registry's steps match the other's.
  "a commentary's own record being started": () =>
    new CommentaryStarted(
      TOURNAMENT,
      "Day one",
      "day-one",
      WRITER,
      causedBy,
      happenedAt,
    ),
  "a comment being added": () =>
    new CommentaryCommentAdded(
      COMMENT,
      "Sam is **two hoops** up",
      causedBy,
      happenedAt,
    ),
  "a comment being edited": () =>
    new CommentaryCommentEdited(
      COMMENT,
      "Sam is **three hoops** up",
      causedBy,
      happenedAt,
    ),
  "a comment being deleted": () =>
    new CommentaryCommentDeleted(COMMENT, causedBy, happenedAt),
  "a commentary's title being changed": () =>
    new CommentaryTitleChanged("Day one, morning", causedBy, happenedAt),
};

// Matched by these happenings alone, so that the steps for the tournament's
// events and the registry's own examples are never matched as well.
const HAPPENINGS = new RegExp(
  `^an event of (${Object.keys(EVENTS)
    .map((happening) => happening.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})$`,
);

Given(
  "a registry that knows a commentary's events",
  function (this: SpecWorld) {
    this.registry = nameCommentaryEvents(new EventRegistry());
  },
);

Given(HAPPENINGS, function (this: SpecWorld, happening: string) {
  const make = EVENTS[happening];
  assert.ok(make !== undefined, `There is no event of ${happening}.`);
  this.pendingEvents.push(make());
});
