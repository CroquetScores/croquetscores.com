import { scenarioOf } from "./aTournament.js";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TeamId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { Team } from "../../../../../src/domain/aggregates/tournaments/Team.js";
import type { TeamPlayer } from "../../../../../src/domain/aggregates/tournaments/TeamPlayer.js";
import type {
  CompetitionInTournament,
  CompetitionShape,
  TestDetails,
  TestPlayed,
  Tournament,
} from "../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { BestOf } from "../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { ExpectedMatches } from "../../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { TestGroup } from "../../../../../src/domain/aggregates/tournaments/value-objects/TestGroup.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";

// What the steps for a tournament played by teams share: its teams, their
// players and its tests, beside what every tournament's steps share
// (aTournament.ts). A module rather than a steps file, so that a feature's
// steps can use it without defining a step twice.

/**
 * A team's short name where a scenario does not say it: the first three
 * letters of its name in capitals, "AUS" for "Australia", so that a scenario
 * about something else need not say it.
 */
export const shortNameFor = (name: string): string =>
  name.slice(0, 3).toUpperCase();

// What a team or a test is to be added or updated as, where the scenario
// says. A test's days are written as "2026-10-03".
interface TeamSaid {
  id?: string;
  shortName?: string;
  flag?: string;
}

interface TeamUpdateSaid {
  name?: string;
  shortName?: string;
  flag?: string;
}

interface TestSaid {
  starts?: string;
  finishes?: string;
  expectedMatches?: number;
  bestOf?: number;
  // Nothing said is the test as it is; null is no group.
  group?: string | null;
}

export interface TestUpdateSaid extends TestSaid {
  // By name, or by id where the scenario names a team the tournament does not
  // have.
  firstTeam?: string;
  secondTeam?: string;
}

interface Scenario {
  team: TeamSaid;
  teamUpdate: TeamUpdateSaid;
  teamPlayerId: string | undefined;
  // The players, as "team/player" by name, whatever asks says have played.
  teamPlayersWithGames: Set<string>;
  test: TestSaid;
  testUpdate: TestUpdateSaid;
  // What whatever asks says has been played in each test, by name.
  played: Map<string, TestPlayed>;
}

// Kept here rather than on the world, which has no business knowing what a
// tournament's teams are.
const scenarios = new WeakMap<SpecWorld, Scenario>();

export const teamScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      team: {},
      teamUpdate: {},
      teamPlayerId: undefined,
      teamPlayersWithGames: new Set(),
      test: {},
      testUpdate: {},
      played: new Map(),
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

/**
 * What the team called `name` is to be added as: what the scenario said of
 * the next team, which is said of that one alone, and otherwise its short
 * name worked out from its name and no flag.
 */
export const teamToAdd = (
  world: SpecWorld,
  name: string,
): {
  readonly id: TeamId;
  readonly details: {
    readonly name: string;
    readonly shortName: string;
    readonly flag?: string;
  };
} => {
  const scenario = teamScenarioOf(world);
  const said = scenario.team;
  scenario.team = {};
  return {
    id: said.id === undefined ? TeamId.create() : TeamId.from(said.id),
    details: {
      name,
      shortName: said.shortName ?? shortNameFor(name),
      ...(said.flag === undefined ? {} : { flag: said.flag }),
    },
  };
};

/** What `team` is, said again with what the scenario's update changes. */
export const teamUpdateOf = (
  world: SpecWorld,
  team: Team | undefined,
): { name: string; shortName: string; flag?: string } => {
  const changed = teamScenarioOf(world).teamUpdate;
  const name = changed.name ?? team?.name.toString() ?? "Australia";
  const flag =
    changed.flag ?? (team?.flag === undefined ? undefined : String(team.flag));
  return {
    name,
    shortName:
      changed.shortName ?? team?.shortName.toString() ?? shortNameFor(name),
    ...(flag === undefined ? {} : { flag }),
  };
};

export const teamNamed = (tournament: Tournament, name: string): Team => {
  const found = tournament.teams.find((team) => team.name.toString() === name);
  assert.ok(
    found !== undefined,
    `The tournament has no team ${name}: ${inspect(tournament.teams.map(String))}`,
  );
  return found;
};

/** The team called `named`, or the team id `named` is, for a team there is not. */
export const teamIdNamed = (tournament: Tournament, named: string): TeamId =>
  named.startsWith("team/")
    ? TeamId.from(named)
    : teamNamed(tournament, named).id;

export const teamPlayerNamed = (team: Team, name: string): TeamPlayer => {
  const found = team.players.find((player) => player.name.toString() === name);
  assert.ok(
    found !== undefined,
    `The team ${String(team)} has no player ${name}: ${inspect(team.players.map(String))}`,
  );
  return found;
};

/** Whatever asks says whether the player `name` of `team` has played. */
export const hasPlayed = (
  world: SpecWorld,
  team: string,
  name: string,
): boolean => teamScenarioOf(world).teamPlayersWithGames.has(`${team}/${name}`);

/** A test, as the tournament has it. */
export type TestShape = Extract<CompetitionShape, { readonly kind: "test" }>;

/**
 * The `place`th test called `name`, the first being 0, counted in the order
 * they were added, archived ones among them: a test archived is given an
 * order after every other, so the order is the order they were added in
 * until one is moved.
 */
export const testNamed = (
  tournament: Tournament,
  name: string,
  place = 0,
): CompetitionInTournament & { readonly shape: TestShape } => {
  const found = tournament.competitions
    .filter(({ reference }) => reference.name.toString() === name)
    .sort((one, other) => one.reference.order - other.reference.order)[place];
  assert.ok(
    found !== undefined,
    `The tournament has no test ${name}: ${inspect(tournament.competitions.map(({ reference }) => String(reference)))}`,
  );
  const { reference, shape, rules } = found;
  assert.ok(shape.kind === "test", `${name} is a ${shape.kind}.`);
  return { reference, shape, rules };
};

/** The start of the day `written` in UTC. */
export const dayAt = (written: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(`${written}T00:00:00Z`));

/** The day `moment` falls on in UTC, written as "2026-10-03". */
export const dayOf = (moment: ReadOnlyDate): string =>
  moment.toISOString().slice(0, 10);

/**
 * What a test between `firstTeam` and `secondTeam` is to be added as: what
 * the scenario said, and otherwise starting and finishing on the
 * tournament's first day, expected to have 1 match, each the best of 1, in
 * no group.
 */
export const testToAdd = (
  world: SpecWorld,
  tournament: Tournament,
  firstTeam: TeamId,
  secondTeam: TeamId,
): TestDetails => {
  const said = teamScenarioOf(world).test;
  const firstDay = dayOf(tournament.starts);
  return {
    firstTeam,
    secondTeam,
    starts: dayAt(said.starts ?? firstDay),
    finishes: dayAt(said.finishes ?? said.starts ?? firstDay),
    expectedMatches: ExpectedMatches.from(said.expectedMatches ?? 1),
    bestOf: BestOf.from(said.bestOf ?? 1),
    group:
      said.group === undefined || said.group === null
        ? undefined
        : TestGroup.from(said.group),
    rules: scenarioOf(world).competition.rules,
  };
};

/** What the test `shape` is, said again with what the scenario's update changes. */
export const testUpdateOf = (
  world: SpecWorld,
  tournament: Tournament,
  shape: TestShape | undefined,
): TestDetails => {
  const changed = teamScenarioOf(world).testUpdate;
  const [first, second] = tournament.teams;
  const teamOf = (
    named: string | undefined,
    kept: TeamId | undefined,
    otherwise: Team | undefined,
  ): TeamId => {
    if (named !== undefined) return teamIdNamed(tournament, named);
    const id = kept ?? otherwise?.id;
    assert.ok(id !== undefined, "The tournament has no team to play in it.");
    return id;
  };
  const group =
    changed.group === undefined
      ? shape?.group
      : changed.group === null
        ? undefined
        : TestGroup.from(changed.group);
  return {
    firstTeam: teamOf(changed.firstTeam, shape?.firstTeam, first),
    secondTeam: teamOf(changed.secondTeam, shape?.secondTeam, second),
    starts:
      changed.starts === undefined
        ? (shape?.starts ?? tournament.starts)
        : dayAt(changed.starts),
    finishes:
      changed.finishes === undefined
        ? (shape?.finishes ?? tournament.starts)
        : dayAt(changed.finishes),
    expectedMatches: ExpectedMatches.from(
      changed.expectedMatches ?? shape?.expectedMatches.count ?? 1,
    ),
    bestOf: BestOf.from(changed.bestOf ?? shape?.bestOf.games ?? 1),
    group,
    rules: scenarioOf(world).competitionUpdate.rules,
  };
};

/** What whatever asks says has been played in the test `name`: nothing, unless said. */
export const playedIn = (world: SpecWorld, name: string): TestPlayed =>
  teamScenarioOf(world).played.get(name) ?? {
    matchesStarted: 0,
    mostGamesBetweenTwo: 0,
  };
