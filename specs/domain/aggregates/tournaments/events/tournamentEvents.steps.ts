import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { BlockAdded } from "../../../../../src/domain/aggregates/tournaments/events/BlockAdded.js";
import { BlockUpdated } from "../../../../../src/domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionArchived } from "../../../../../src/domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionMoved } from "../../../../../src/domain/aggregates/tournaments/events/CompetitionMoved.js";
import { CompetitionRestored } from "../../../../../src/domain/aggregates/tournaments/events/CompetitionRestored.js";
import { CompetitionsSpacedOut } from "../../../../../src/domain/aggregates/tournaments/events/CompetitionsSpacedOut.js";
import { KnockoutAdded } from "../../../../../src/domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../../../../src/domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { ManagerAdded } from "../../../../../src/domain/aggregates/tournaments/events/ManagerAdded.js";
import { ManagerRemoved } from "../../../../../src/domain/aggregates/tournaments/events/ManagerRemoved.js";
import { ScorerAdded } from "../../../../../src/domain/aggregates/tournaments/events/ScorerAdded.js";
import { ScorerRemoved } from "../../../../../src/domain/aggregates/tournaments/events/ScorerRemoved.js";
import { SwissAdded } from "../../../../../src/domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../../../../src/domain/aggregates/tournaments/events/SwissUpdated.js";
import { TournamentArchived } from "../../../../../src/domain/aggregates/tournaments/events/TournamentArchived.js";
import {
  TournamentCreated,
  type WrittenTournament,
} from "../../../../../src/domain/aggregates/tournaments/events/TournamentCreated.js";
import { nameTournamentEvents } from "../../../../../src/domain/aggregates/tournaments/events/tournamentEvents.js";
import { TournamentPlayerAdded } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerMoved } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerMoved.js";
import { TournamentPlayerRestored } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayersSpacedOut } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayersSpacedOut.js";
import { TournamentPlayerUpdated } from "../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TournamentRestored } from "../../../../../src/domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../../../../src/domain/aggregates/tournaments/events/TournamentUpdated.js";
import { TeamAdded } from "../../../../../src/domain/aggregates/tournaments/events/TeamAdded.js";
import { TeamArchived } from "../../../../../src/domain/aggregates/tournaments/events/TeamArchived.js";
import { TeamMoved } from "../../../../../src/domain/aggregates/tournaments/events/TeamMoved.js";
import { TeamPlayerAdded } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayerAdded.js";
import { TeamPlayerArchived } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamPlayerMoved } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayerMoved.js";
import { TeamPlayerRestored } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamPlayersSpacedOut } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayersSpacedOut.js";
import { TeamPlayerUpdated } from "../../../../../src/domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TeamRestored } from "../../../../../src/domain/aggregates/tournaments/events/TeamRestored.js";
import { TeamsSpacedOut } from "../../../../../src/domain/aggregates/tournaments/events/TeamsSpacedOut.js";
import { TeamUpdated } from "../../../../../src/domain/aggregates/tournaments/events/TeamUpdated.js";
import { TestAdded } from "../../../../../src/domain/aggregates/tournaments/events/TestAdded.js";
import { TestUpdated } from "../../../../../src/domain/aggregates/tournaments/events/TestUpdated.js";
import type { DomainEvent } from "../../../../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../../../../src/domain/common/EventRegistry.js";
import { causedBy, happenedAt } from "../../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../../support/world.js";

// Every field of a tournament said, with something in it, so that a field a
// reader dropped or read wrongly is found by what was read back.
const A_TOURNAMENT: WrittenTournament = {
  name: "Spring Open",
  starts: "2026-10-03T00:00:00.000Z",
  finishes: "2026-10-05T00:00:00.000Z",
  format: "Standard",
  sport: "ac",
  country: "au",
  region: "vic",
  subtitle: "Lunch is at noon.",
  // Drawn, for the same reason.
  levelTestsDrawn: true,
  national: true,
  international: false,
  address: "2026/ac/spring-open",
};

const PLAYER = "tournament-player/123e4567-e89b-42d3-a456-426614174000";
const ANOTHER_PLAYER = "tournament-player/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const ANOTHER_ACCOUNT = "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const COMPETITION = "competition/123e4567-e89b-42d3-a456-426614174000";
const ANOTHER_COMPETITION = "competition/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const TEAM = "team/123e4567-e89b-42d3-a456-426614174000";
const ANOTHER_TEAM = "team/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";
const TEAM_PLAYER = "team-player/123e4567-e89b-42d3-a456-426614174000";
const ANOTHER_TEAM_PLAYER = "team-player/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b";

// One event of each kind a tournament records, as a feature names what
// happened, and those an event can do without left out.
const EVENTS: Readonly<Record<string, () => DomainEvent>> = {
  "a tournament being created": () =>
    new TournamentCreated(
      "croquetscores.com",
      A_TOURNAMENT,
      causedBy,
      happenedAt,
    ),
  "a tournament being created with no subtitle": () =>
    new TournamentCreated(
      "croquetscores.com",
      { ...A_TOURNAMENT, subtitle: undefined },
      causedBy,
      happenedAt,
    ),
  "a tournament being updated": () =>
    new TournamentUpdated(
      { ...A_TOURNAMENT, name: "Spring Open Championship" },
      causedBy,
      happenedAt,
    ),
  "a tournament being archived": () =>
    new TournamentArchived(causedBy, happenedAt),
  "a tournament being restored": () =>
    new TournamentRestored(causedBy, happenedAt),
  "a player being added": () =>
    new TournamentPlayerAdded(
      PLAYER,
      "Sam Someone",
      "Canterbury Croquet Club",
      "4",
      "nz",
      "Samuel Someone",
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being added who represents nothing": () =>
    new TournamentPlayerAdded(
      PLAYER,
      "Sam Someone",
      undefined,
      "4",
      "nz",
      "Samuel Someone",
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being added who flies no flag": () =>
    new TournamentPlayerAdded(
      PLAYER,
      "Sam Someone",
      "Canterbury Croquet Club",
      "4",
      undefined,
      "Samuel Someone",
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being added with no handicap": () =>
    new TournamentPlayerAdded(
      PLAYER,
      "Sam Someone",
      "Canterbury Croquet Club",
      undefined,
      "nz",
      "Samuel Someone",
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being updated": () =>
    new TournamentPlayerUpdated(
      PLAYER,
      "Samantha Someone",
      "Canterbury Croquet Club",
      "4",
      "au",
      "Samuel Someone",
      causedBy,
      happenedAt,
    ),
  "a player being added with no world ranking name": () =>
    new TournamentPlayerAdded(
      PLAYER,
      "Sam Someone",
      "Canterbury Croquet Club",
      "4",
      "nz",
      undefined,
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player being archived": () =>
    new TournamentPlayerArchived(PLAYER, 20000, causedBy, happenedAt),
  "a player being restored": () =>
    new TournamentPlayerRestored(PLAYER, causedBy, happenedAt),
  "a tournament's player being moved": () =>
    new TournamentPlayerMoved(PLAYER, 5000, causedBy, happenedAt),
  // Two, so that one read back in the wrong order is found.
  "the tournament's players being spaced out": () =>
    new TournamentPlayersSpacedOut(
      [ANOTHER_PLAYER, PLAYER],
      causedBy,
      happenedAt,
    ),
  "a block being added": () =>
    new BlockAdded(
      COMPETITION,
      "Block A",
      "block-a",
      10000,
      2,
      // More than the 1 a block is played in unless it says, so that one read
      // back as played once is found.
      3,
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      "who-beat-who",
      causedBy,
      happenedAt,
    ),
  "a block being updated": () =>
    new BlockUpdated(
      COMPETITION,
      "Block One",
      3,
      2,
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      "other",
      causedBy,
      happenedAt,
    ),
  "a knockout being added": () =>
    new KnockoutAdded(
      COMPETITION,
      "Main Event",
      "main-event",
      20000,
      4,
      [1, 3],
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a losers knockout being added": () =>
    new KnockoutAdded(
      COMPETITION,
      "Plate",
      "plate",
      30000,
      2,
      [1],
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
      "competition/123e4567-e89b-42d3-a456-426614174099",
      0,
    ),
  "a knockout being updated": () =>
    new KnockoutUpdated(
      COMPETITION,
      "Main Draw",
      8,
      [1, 1, 3],
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a Swiss being added": () =>
    new SwissAdded(
      COMPETITION,
      "Swiss",
      "swiss",
      30000,
      2,
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a Swiss being updated": () =>
    new SwissUpdated(
      COMPETITION,
      "Swiss Stage",
      3,
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a competition being archived": () =>
    new CompetitionArchived(COMPETITION, 40000, causedBy, happenedAt),
  "an account being made a manager": () =>
    new ManagerAdded(ANOTHER_ACCOUNT, causedBy, happenedAt),
  "an account being taken off the managers": () =>
    new ManagerRemoved(ANOTHER_ACCOUNT, causedBy, happenedAt),
  "an account being made a scorer": () =>
    new ScorerAdded(ANOTHER_ACCOUNT, causedBy, happenedAt),
  "an account being taken off the scorers": () =>
    new ScorerRemoved(ANOTHER_ACCOUNT, causedBy, happenedAt),
  "a competition being restored": () =>
    new CompetitionRestored(COMPETITION, causedBy, happenedAt),
  "a competition being moved": () =>
    new CompetitionMoved(COMPETITION, 15000, causedBy, happenedAt),
  // Two, so that one read back in the wrong order is found.
  "the competitions being spaced out": () =>
    new CompetitionsSpacedOut(
      [ANOTHER_COMPETITION, COMPETITION],
      causedBy,
      happenedAt,
    ),
  "a team being added": () =>
    new TeamAdded(
      TEAM,
      "Australia",
      "AUS",
      "au",
      "aus",
      10000,
      causedBy,
      happenedAt,
    ),
  "a team being added that flies no flag": () =>
    new TeamAdded(
      TEAM,
      "Australia",
      "AUS",
      undefined,
      "aus",
      10000,
      causedBy,
      happenedAt,
    ),
  "a team being updated": () =>
    new TeamUpdated(TEAM, "Australia A", "AUS A", "au", causedBy, happenedAt),
  "a team being archived": () =>
    new TeamArchived(TEAM, 30000, causedBy, happenedAt),
  "a team being restored": () => new TeamRestored(TEAM, causedBy, happenedAt),
  "a team being moved": () => new TeamMoved(TEAM, 15000, causedBy, happenedAt),
  // Two, so that one read back in the wrong order is found.
  "the teams being spaced out": () =>
    new TeamsSpacedOut([ANOTHER_TEAM, TEAM], causedBy, happenedAt),
  "a player being added to a team": () =>
    new TeamPlayerAdded(
      TEAM,
      TEAM_PLAYER,
      "Sam Someone",
      "Samuel Someone",
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player in a team being updated": () =>
    new TeamPlayerUpdated(
      TEAM,
      TEAM_PLAYER,
      "Samantha Someone",
      "Samuel Someone",
      causedBy,
      happenedAt,
    ),
  "a player being added to a team with no world ranking name": () =>
    new TeamPlayerAdded(
      TEAM,
      TEAM_PLAYER,
      "Sam Someone",
      undefined,
      "sam-someone",
      10000,
      causedBy,
      happenedAt,
    ),
  "a player in a team being archived": () =>
    new TeamPlayerArchived(TEAM, TEAM_PLAYER, 30000, causedBy, happenedAt),
  "a player in a team being restored": () =>
    new TeamPlayerRestored(TEAM, TEAM_PLAYER, causedBy, happenedAt),
  "a player in a team being moved": () =>
    new TeamPlayerMoved(TEAM, TEAM_PLAYER, 15000, causedBy, happenedAt),
  "a team's players being spaced out": () =>
    new TeamPlayersSpacedOut(
      TEAM,
      [ANOTHER_TEAM_PLAYER, TEAM_PLAYER],
      causedBy,
      happenedAt,
    ),
  "a test being added": () =>
    new TestAdded(
      COMPETITION,
      TEAM,
      ANOTHER_TEAM,
      "aus-v-eng",
      10000,
      "2026-10-03",
      "2026-10-05",
      21,
      3,
      "Group A",
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a test being added in no group": () =>
    new TestAdded(
      COMPETITION,
      TEAM,
      ANOTHER_TEAM,
      "aus-v-eng",
      10000,
      "2026-10-03",
      "2026-10-05",
      21,
      3,
      undefined,
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
  "a test being updated": () =>
    new TestUpdated(
      COMPETITION,
      ANOTHER_TEAM,
      TEAM,
      "2026-10-04",
      "2026-10-05",
      9,
      2,
      "Group B",
      // Each the opposite of what a competition has unless it is said, so
      // that one read back as the default is found.
      true,
      true,
      false,
      // Not the usual for any sport, so that one read back as the usual is found.
      14,
      causedBy,
      happenedAt,
    ),
};

// Matched by the happenings above alone, so that the steps the registry's own
// feature has for its example events are never matched as well.
const HAPPENINGS = new RegExp(
  `^an event of (${Object.keys(EVENTS).join("|")})$`,
);

const writtenOf = (world: SpecWorld): DomainEvent => {
  const event = world.pendingEvents.at(-1);
  assert.ok(event !== undefined, "No event has been named.");
  return event;
};

const readBackOf = (world: SpecWorld): DomainEvent => {
  assert.ok(
    world.readBackEvent !== undefined,
    `Nothing was read back: ${inspect(world.failure)}`,
  );
  return world.readBackEvent;
};

// What was kept of the event, as the registry writes it down, with `spoiling`
// done to it, to be read back as something a table might have held.
const keptSpoilt = (
  world: SpecWorld,
  spoiling: (data: Record<string, unknown>) => void,
): void => {
  assert.ok(world.registry !== undefined, "No registry has been put together.");
  const kept = world.registry.writeDown(writtenOf(world));
  const data = { ...kept.data };
  spoiling(data);
  world.kept = { name: kept.name, data };
};

Given(
  "a registry that knows a tournament's events",
  function (this: SpecWorld) {
    this.registry = nameTournamentEvents(new EventRegistry());
  },
);

Given(HAPPENINGS, function (this: SpecWorld, happening: string) {
  const make = EVENTS[happening];
  assert.ok(make !== undefined, `There is no event of ${happening}.`);
  this.pendingEvents.push(make());
});

Given(
  "it was written down through the registry without its {word}",
  function (this: SpecWorld, field: string) {
    keptSpoilt(this, (data) => {
      assert.ok(field in data, `The event has no ${field} to leave out.`);
      delete data[field];
    });
  },
);

Given(
  "it was written down through the registry with its {word} as the text {string}",
  function (this: SpecWorld, field: string, written: string) {
    keptSpoilt(this, (data) => {
      data[field] = written;
    });
  },
);

Given(
  "it was written down through the registry with its {word} as the number {int}",
  function (this: SpecWorld, field: string, written: number) {
    keptSpoilt(this, (data) => {
      data[field] = written;
    });
  },
);

Given(
  "it was written down through the registry with its {word} as a list holding the text {string}",
  function (this: SpecWorld, field: string, written: string) {
    keptSpoilt(this, (data) => {
      data[field] = [written];
    });
  },
);

Given(
  "it was written down through the registry with its {word} as a list holding the number {int}",
  function (this: SpecWorld, field: string, written: number) {
    keptSpoilt(this, (data) => {
      data[field] = [written];
    });
  },
);

Then(
  "what was read back is the kind of event that was written down",
  function (this: SpecWorld) {
    assert.equal(
      readBackOf(this).constructor,
      writtenOf(this).constructor,
      `It was read back as ${inspect(this.readBackEvent)}.`,
    );
  },
);

// Compared as each is written down, which is everything an event says, the
// account that caused it and the moment it happened among it.
Then(
  "what was read back says everything the event said",
  function (this: SpecWorld) {
    assert.deepEqual(
      JSON.parse(JSON.stringify(readBackOf(this))),
      JSON.parse(JSON.stringify(writtenOf(this))),
    );
  },
);
