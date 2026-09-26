import { strict as assert } from "node:assert";

import type { Command } from "../../../../src/application/common/Command.js";
import type { TournamentRequest } from "../../../../src/application/operations/tournaments/tournamentOperations.js";
import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../../src/domain/common/validation/Validator.js";
import type { Registering } from "../../../support/registering.js";
import type { TournamentsInHand } from "../../../support/tournaments.js";
import type { SpecWorld } from "../../../support/world.js";
import { scenarioOf as domainScenarioOf } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";

// What the steps for each of a tournament's operations share. A module rather
// than a steps file, so that a feature's steps can use it without defining a
// step twice.
//
// What a request is to carry is said in the words the tournament's own
// features use — "the tournament name", "the update calls it" — so those steps
// are the domain's, and what they say is read from where they keep it. What
// the tournament is afterwards is read back from the store and put where the
// domain's steps look, so "the tournament is called" means the same thing in
// both.

interface Scenario {
  // Every tournament the scenario has created, in order, and the first by
  // each name, since a scenario names a tournament by what it is called.
  readonly created: TournamentId[];
  readonly byName: Map<string, TournamentId>;
  // The tournament the scenario is looking at: the last one asked about.
  looking: TournamentId | undefined;
  // How many events it had before the request the scenario is about.
  eventsBefore: number;
  // Where the request came to, and what it says of a value, as typed, where
  // the scenario says something no step of the tournament's could make.
  website: string | undefined;
  readonly says: Record<string, string>;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

export const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      created: [],
      byName: new Map(),
      looking: undefined,
      eventsBefore: 0,
      website: undefined,
      says: {},
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

export const inHandOf = (world: SpecWorld): TournamentsInHand => {
  assert.ok(
    world.tournamentsInHand !== undefined,
    "The application's tournaments are not stood up.",
  );
  return world.tournamentsInHand;
};

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

export const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

/**
 * The id of the account for `address`. Asking for it makes every account the
 * scenario said there was, so that whatever the request finds is there.
 */
export const accountFor = async (
  world: SpecWorld,
  address: string,
): Promise<AccountId> => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account.id;
};

/** The account the scenario took hold of, as the session would name it. */
export const heldAccount = (world: SpecWorld): string => {
  assert.ok(world.accountHeld !== undefined, "The scenario holds no account.");
  return world.accountHeld;
};

/** The tournament the scenario calls `name`. */
export const tournamentNamed = (
  world: SpecWorld,
  name: string,
): TournamentId => {
  const id = scenarioOf(world).byName.get(name);
  assert.ok(id !== undefined, `No tournament called ${name} was created.`);
  return id;
};

/** A tournament id that names nothing. */
export const noTournament = (): TournamentId => TournamentId.create();

export const load = async (
  world: SpecWorld,
  id: TournamentId,
): Promise<Tournament> => {
  const tournament = await inHandOf(world).load(id);
  assert.ok(tournament !== undefined, `${id.value} has no events.`);
  return tournament;
};

/**
 * Sends `command`, about the tournament `about` when there is one, and keeps
 * whatever came of it rather than throwing: some scenarios are about how it is
 * refused. The tournament is read back afterwards and put where the domain's
 * steps look.
 */
export const send = async <TResult>(
  world: SpecWorld,
  command: Command<TResult>,
  about: TournamentId | undefined,
): Promise<void> => {
  const scenario = scenarioOf(world);
  const inHand = inHandOf(world);
  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  scenario.eventsBefore =
    about === undefined ? 0 : (await inHand.eventsOf(about)).length;
  scenario.looking = about;
  try {
    world.answer = await inHand.send(command);
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
  await lookAtAgain(world);
};

/** The tournament the scenario is looking at, read back again. */
export const lookAtAgain = async (world: SpecWorld): Promise<void> => {
  const { looking } = scenarioOf(world);
  world.aggregate =
    looking === undefined ? undefined : await inHandOf(world).load(looking);
};

/** That what was sent was not refused, for a step saying something was done. */
export const assertDone = (world: SpecWorld): void => {
  assert.equal(
    world.failure,
    undefined,
    `It was refused: ${String(world.failure)}`,
  );
};

/** That the scenario now looks at `id`, which it created or named. */
export const lookAt = async (
  world: SpecWorld,
  id: TournamentId,
): Promise<void> => {
  scenarioOf(world).looking = id;
  await lookAtAgain(world);
};

/**
 * The request to create the tournament the scenario describes, in the words
 * the tournament's own features use, with anything it says a request says
 * put in as typed. What it leaves unsaid is a tournament that is well made: the
 * Spring Open, in the first sport and format its site offers, from 3 to 5
 * October 2026, in Victoria.
 */
export const creationOf = (world: SpecWorld): TournamentRequest => {
  const said = domainScenarioOf(world).creating;
  const { says, website } = scenarioOf(world);
  const site = Website.from(website ?? "croquetscores.com").site;
  const starts = said.starts ?? "2026-10-03T00:00:00Z";
  return {
    name: says.name ?? said.name ?? "Spring Open",
    starts: says.starts ?? starts,
    finishes:
      says.finishes ??
      said.finishes ??
      (said.starts === undefined ? "2026-10-05T00:00:00Z" : starts),
    format: says.format ?? world.tournamentFormat?.name ?? "Standard",
    sport:
      says.sport ??
      world.sport?.code ??
      (site === "gateballScores" ? "gb" : "ac"),
    country: says.country ?? said.country ?? "au",
    region: said.region ?? "vic",
    ...(says.notes !== undefined
      ? { notes: says.notes }
      : typeof said.notes === "string"
        ? { notes: said.notes }
        : {}),
    handicap: said.handicap,
    worldRankings: said.worldRankings,
    national: said.national,
    international: said.international,
  };
};

/**
 * The request to update `tournament`: everything it is, said again, with what
 * the scenario's update changes, and anything it says a request says put in as
 * typed.
 */
export const updateOf = (
  world: SpecWorld,
  tournament: Tournament,
): TournamentRequest => {
  const changed = domainScenarioOf(world).updating;
  const { says } = scenarioOf(world);
  const notes = changed.notes ?? tournament.notes?.markdown;
  return {
    name: says.name ?? changed.name ?? tournament.name.toString(),
    starts: changed.starts ?? tournament.starts.toISOString(),
    finishes: changed.finishes ?? tournament.finishes.toISOString(),
    format: says.format ?? changed.format ?? tournament.format.name,
    sport: says.sport ?? changed.sport ?? tournament.sport.code,
    country: says.country ?? tournament.country.code,
    region: changed.region ?? tournament.region.code,
    ...(typeof notes === "string" ? { notes } : {}),
    handicap: changed.handicap ?? tournament.handicap,
    worldRankings: tournament.worldRankings,
    national: tournament.national,
    international: changed.international ?? tournament.international,
  };
};

/** Records a tournament the scenario created as `name`. */
export const created = (
  world: SpecWorld,
  id: TournamentId,
  name: string,
): void => {
  const scenario = scenarioOf(world);
  scenario.created.push(id);
  if (!scenario.byName.has(name)) scenario.byName.set(name, id);
};

/** The ids of every tournament the scenario created, in order. */
export const everyCreated = (world: SpecWorld): readonly TournamentId[] =>
  scenarioOf(world).created;
