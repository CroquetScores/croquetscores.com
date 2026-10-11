import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  Competition,
  type Told,
} from "../../../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import type { CompetitionPlayer } from "../../../../../../src/domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { GamePlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import { byOf, now } from "../../tournament/aTournament.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What the steps for each of a competition's features share: the stream a
// scenario says the competition already has, the tournament players it names,
// and the competition rebuilt from the stream, which is what the scenario asks
// things of. A module rather than a steps file, so that a feature's steps can
// use it without defining a step twice. Who asks and when are the tournament's
// steps', since a competition is asked by whoever the tournament lets.

interface Scenario {
  readonly id: CompetitionId;
  // What the competition's stream holds before the scenario's own request.
  readonly stream: DomainEvent[];
  // Each tournament player the scenario names, by name, so that a name means
  // the same tournament player throughout.
  readonly tournamentPlayers: Map<string, TournamentPlayerId>;
  // The orders in the tournament the scenario gives, by name.
  readonly tournamentOrders: Map<string, number>;
  // In a test, each team the scenario names, by name, and each player of
  // theirs, by name, so that a name means the same team or player throughout.
  readonly teams: Map<string, TeamId>;
  readonly teamPlayers: Map<string, TeamPlayerId>;
  // What the competition is told of itself: a block, each match the best of
  // 1, in a tournament that does not allow drawn games, unless the scenario
  // says otherwise.
  told: Told;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

export const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      id: CompetitionId.create(),
      stream: [],
      tournamentPlayers: new Map(),
      tournamentOrders: new Map(),
      teams: new Map(),
      teamPlayers: new Map(),
      told: {
        shape: {
          kind: "block",
          bestOf: BestOf.from(1),
          rounds: Rounds.from(1),
        },
        drawsAllowed: false,
      },
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

export const tournamentPlayerNamed = (
  world: SpecWorld,
  name: string,
): TournamentPlayerId => {
  const players = scenarioOf(world).tournamentPlayers;
  let id = players.get(name);
  if (id === undefined) {
    id = TournamentPlayerId.create();
    players.set(name, id);
  }
  return id;
};

// How far apart the tournament players a scenario names without orders are, in
// the order it first names them, as a tournament that added them in that order
// and moved none of them would have them (enterPlayer.feature).
const ORDER_STEP = 10_000;

/** The team called `name`, in a test. */
export const teamNamed = (world: SpecWorld, name: string): TeamId => {
  const { teams } = scenarioOf(world);
  let id = teams.get(name);
  if (id === undefined) {
    id = TeamId.create();
    teams.set(name, id);
  }
  return id;
};

/** The player of a team called `name`, in a test. */
export const teamPlayerNamed = (
  world: SpecWorld,
  name: string,
): TeamPlayerId => {
  const { teamPlayers } = scenarioOf(world);
  let id = teamPlayers.get(name);
  if (id === undefined) {
    id = TeamPlayerId.create();
    teamPlayers.set(name, id);
  }
  return id;
};

/** Whether the competition is a test, whose players are its teams'. */
export const isATest = (world: SpecWorld): boolean =>
  scenarioOf(world).told.shape.kind === "test";

/**
 * Who the player called `name` is in a game of `competition`: the player of a
 * team, in a test, which has no players entered; anywhere else, the
 * competition's player who is that tournament player.
 */
export const gamePlayerNamed = (
  world: SpecWorld,
  competition: Competition,
  name: string,
): GamePlayerId =>
  isATest(world)
    ? teamPlayerNamed(world, name)
    : playerNamed(world, competition, name).id;

/** The order in the tournament of the tournament player called `name`. */
export const tournamentOrderOf = (world: SpecWorld, name: string): number => {
  tournamentPlayerNamed(world, name);
  const scenario = scenarioOf(world);
  return (
    scenario.tournamentOrders.get(name) ??
    ([...scenario.tournamentPlayers.keys()].indexOf(name) + 1) * ORDER_STEP
  );
};

/** What the competition is told of itself, as the scenario says it. */
export const toldOf = (world: SpecWorld): Told => scenarioOf(world).told;

const rebuilt = (world: SpecWorld): Competition => {
  const scenario = scenarioOf(world);
  return Competition.rebuiltFrom(scenario.id, scenario.stream);
};

/** The competition rebuilt from the stream, which the scenario looks at next. */
export const rebuild = (world: SpecWorld): void => {
  world.aggregate = rebuilt(world);
};

/**
 * That `happening` happened to the competition after everything the stream
 * holds already: done to the competition the stream leaves, so that it
 * records what it would, and what it recorded added to the stream.
 */
export const happened = (
  world: SpecWorld,
  happening: (competition: Competition) => void,
): void => {
  const competition = rebuilt(world);
  happening(competition);
  scenarioOf(world).stream.push(...competition.handOver());
};

/** That the event `making` makes of the competition the stream leaves happened after it. */
export const happenedAs = (
  world: SpecWorld,
  making: (competition: Competition) => DomainEvent,
): void => {
  scenarioOf(world).stream.push(making(rebuilt(world)));
};

export const competitionOf = (world: SpecWorld): Competition => {
  assert.ok(
    world.aggregate instanceof Competition,
    `There is no competition: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// Asking a competition something may be refused, and the scenario says
// whether it expects that, so a refusal is kept rather than thrown.
export const ask = (
  world: SpecWorld,
  asking: (competition: Competition) => void,
): void => {
  try {
    asking(competitionOf(world));
  } catch (failure) {
    world.failure = failure;
  }
};

/** The player in `competition` who is the tournament player called `name`. */
export const playerNamed = (
  world: SpecWorld,
  competition: Competition,
  name: string,
): CompetitionPlayer => {
  const tournamentPlayer = tournamentPlayerNamed(world, name);
  const found = competition.players.find((player) =>
    player.tournamentPlayerId.equals(tournamentPlayer),
  );
  assert.ok(found !== undefined, `The competition has no player ${name}.`);
  return found;
};

export { byOf, now };

// The thing the competition recorded at `index`, the first being 0, which has
// to be of the kind `kind`.
export const assertRecordedAt = <T extends DomainEvent>(
  world: SpecWorld,
  index: number,
  kind: abstract new (...args: never[]) => T,
): T => {
  const event = competitionOf(world).recorded[index];
  assert.ok(event !== undefined, `It recorded nothing at ${String(index)}.`);
  assert.ok(event instanceof kind, `It recorded ${inspect(event)}.`);
  return event;
};
