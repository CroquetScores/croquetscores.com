import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { nameCompetitionEvents } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/competitionEvents.js";
import { CompetitionGameAdded } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameArchived.js";
import { CompetitionGameRestored } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameRestored.js";
import { CompetitionPlayerEntered } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerEntered.js";
import { CompetitionPlayerMoved } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerMoved.js";
import { CompetitionPlayerRemoved } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerRemoved.js";
import { CompetitionPlayersSpacedOut } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayersSpacedOut.js";
import { CompetitionPlayerWithdrawalReversed } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawalReversed.js";
import { CompetitionPlayerWithdrawn } from "../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawn.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../../../../../src/domain/common/EventRegistry.js";
import { causedBy, happenedAt } from "../../../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What writing each event down and reading it back asks of the registry is
// the tournament's events' steps' (tournamentEvents.steps.ts): these name a
// competition's events, each with something in every field, so that a field
// dropped or read wrongly is found by what is read back.

const PLAYER = "competition-player/123e4567-e89b-42d3-a456-426614174000";
const ANOTHER_PLAYER =
  "competition-player/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const GAME = "game/123e4567-e89b-42d3-a456-426614174000";
const TOURNAMENT_PLAYER =
  "tournament-player/123e4567-e89b-42d3-a456-426614174000";

const EVENTS: Readonly<Record<string, () => DomainEvent>> = {
  "a player being entered": () =>
    new CompetitionPlayerEntered(
      PLAYER,
      TOURNAMENT_PLAYER,
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being moved": () =>
    new CompetitionPlayerMoved(PLAYER, 15000, causedBy, happenedAt),
  // Two, so that one read back in the wrong order is found.
  "the players being spaced out": () =>
    new CompetitionPlayersSpacedOut(
      [ANOTHER_PLAYER, PLAYER],
      causedBy,
      happenedAt,
    ),
  "a player withdrawing": () =>
    new CompetitionPlayerWithdrawn(PLAYER, 30000, causedBy, happenedAt),
  "a player's withdrawal being reversed": () =>
    new CompetitionPlayerWithdrawalReversed(PLAYER, causedBy, happenedAt),
  "a player being removed": () =>
    new CompetitionPlayerRemoved(PLAYER, causedBy, happenedAt),
  "a game being added": () =>
    new CompetitionGameAdded(
      GAME,
      PLAYER,
      "6w",
      true,
      ANOTHER_PLAYER,
      "6tp",
      causedBy,
      happenedAt,
    ),
  "a game being archived": () =>
    new CompetitionGameArchived(GAME, causedBy, happenedAt),
  "a game being restored": () =>
    new CompetitionGameRestored(GAME, causedBy, happenedAt),
};

// Matched by these happenings alone, so that the steps for the tournament's
// events and the registry's own examples are never matched as well.
const HAPPENINGS = new RegExp(
  `^an event of (${Object.keys(EVENTS)
    .map((happening) => happening.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})$`,
);

Given(
  "a registry that knows a competition's events",
  function (this: SpecWorld) {
    this.registry = nameCompetitionEvents(new EventRegistry());
  },
);

Given(HAPPENINGS, function (this: SpecWorld, happening: string) {
  const make = EVENTS[happening];
  assert.ok(make !== undefined, `There is no event of ${happening}.`);
  this.pendingEvents.push(make());
});
