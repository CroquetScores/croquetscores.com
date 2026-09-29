import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import { BestOf } from "../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentPlayer } from "../../../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type AddressTaken,
  type CompetitionInTournament,
  Tournament,
  type TournamentDetails,
} from "../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { Countries } from "../../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../../../../../src/domain/aggregates/tournaments/value-objects/Country.js";
import { KnockoutDraw } from "../../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Sport } from "../../../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentAddress } from "../../../../../src/domain/aggregates/tournaments/value-objects/TournamentAddress.js";
import { TournamentFormat } from "../../../../../src/domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import { TournamentName } from "../../../../../src/domain/aggregates/tournaments/value-objects/TournamentName.js";
import { TournamentNotes } from "../../../../../src/domain/aggregates/tournaments/value-objects/TournamentNotes.js";
import type { DomainEvent } from "../../../../../src/domain/common/DomainEvent.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import { Website } from "../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../support/world.js";

// What the steps for each of a tournament's methods share. A module rather
// than a steps file, so that a feature's steps can use it without defining a
// step twice, and kept here rather than in specs/support, since nothing but a
// tournament's features has any use for it.

/**
 * What a scenario says of a tournament, each part written as the feature
 * writes it. What it leaves unsaid is a tournament that is well made, so that
 * what is refused is only ever what the scenario named. Notes are nothing when
 * a scenario says there are none, and left unsaid otherwise.
 */
export interface Said {
  website?: string;
  name?: string;
  starts?: string;
  finishes?: string;
  format?: string;
  sport?: string;
  country?: string;
  region?: string;
  notes?: string | null;
  handicap?: boolean;
  drawsAllowed?: boolean;
  worldRankings?: boolean;
  national?: boolean;
  international?: boolean;
}

// What a player or a competition is to be added or updated as, where the
// scenario says.
interface PlayerSaid {
  id?: string;
  name?: string;
  representing?: string;
  flag?: string;
}

interface CompetitionSaid {
  id?: string;
  name?: string;
  bestOf?: number;
}

interface Scenario {
  id: TournamentId;
  // What the tournament the stream begins with was created as, and what
  // happened to it after.
  created: Said | undefined;
  later: DomainEvent[];
  // What a tournament the scenario creates is to be created as, and what an
  // update of it says.
  creating: Said;
  updating: Said;
  taken: Set<string>;
  player: PlayerSaid;
  playerUpdate: PlayerSaid;
  // The players and the knockouts, by name, that whatever asks says have
  // games.
  playersWithGames: Set<string>;
  competition: CompetitionSaid;
  competitionUpdate: CompetitionSaid;
  // The shape of a knockout's draw a scenario gives, adding it or updating it.
  drawPlaces: number | undefined;
  drawRounds: number[];
  competitionsWithGames: Set<string>;
  updateMovesAPlayerWithGames: boolean;
}

// The tournament a scenario is about when it does not say which.
export const A_TOURNAMENT_ID =
  "tournament/7c9e6679-7425-40de-944b-e07fc1f90ae7";

// Kept here rather than on the world, which has no business knowing what a
// tournament's events are.
const scenarios = new WeakMap<SpecWorld, Scenario>();

export const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      id: TournamentId.from(A_TOURNAMENT_ID),
      created: undefined,
      later: [],
      creating: {},
      updating: {},
      taken: new Set(),
      player: {},
      playerUpdate: {},
      playersWithGames: new Set(),
      competition: {},
      competitionUpdate: {},
      drawPlaces: undefined,
      drawRounds: [],
      competitionsWithGames: new Set(),
      updateMovesAPlayerWithGames: false,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

/**
 * Whether the scenario is about a tournament, having begun a tournament's
 * stream: for the steps a tournament's features and a competition's share
 * word for word, such as moving a player, which each does to its own.
 */
export const isAboutATournament = (world: SpecWorld): boolean =>
  scenarios.get(world)?.created !== undefined;

// The account the Background names, which created the tournament and so
// manages it, and which is whoever does what the stream says was done.
export const creatorOf = (world: SpecWorld): AccountId => {
  assert.ok(world.account !== undefined, "No account has been named.");
  return world.account;
};

// Every event of a tournament says whoever asked caused it: whoever the
// scenario says asks, or the account the Background names when it does not.
export const byOf = (world: SpecWorld): AccountId =>
  world.askedBy ?? creatorOf(world);

export const now = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

export const at = (moment: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(moment));

export const takenOf =
  (world: SpecWorld): AddressTaken =>
  (address) =>
    scenarioOf(world).taken.has(address.toString());

const countryCalled = (code: string): Country => {
  const country = Countries.thereAre.find(code);
  assert.ok(country !== undefined, `There is no country ${code}.`);
  return country;
};

// A tournament's first region, when a scenario names its country and not its
// region, so that the region is always the country's.
const regionOf = (country: Country, said: string | undefined): string => {
  if (said !== undefined) return said;
  if (country.code === "au") return "vic";
  const first = country.regions[0];
  assert.ok(first !== undefined, `${country.code} has no regions.`);
  return first.code;
};

/** The website `said` names, or Croquet Scores's own. */
export const websiteOf = (said: Said): Website =>
  Website.from(said.website ?? "croquetscores.com");

/**
 * The details of a tournament that is as `said` says, and otherwise well made:
 * the Spring Open, in the first sport and the first format its site offers,
 * from 3 to 5 October 2026, in Victoria. A tournament whose start is said and
 * whose finish is not finishes when it starts, so that saying one never makes
 * the other wrong.
 */
export const detailsOf = (said: Said): TournamentDetails => {
  const website = websiteOf(said);
  const country = countryCalled(said.country ?? "au");
  const starts = said.starts ?? "2026-10-03T00:00:00Z";
  return {
    name: TournamentName.from(said.name ?? "Spring Open"),
    starts: at(starts),
    finishes: at(
      said.finishes ??
        (said.starts === undefined ? "2026-10-05T00:00:00Z" : starts),
    ),
    format: TournamentFormat.from(said.format ?? "Standard"),
    sport: Sport.from(
      said.sport ?? (website.site === "gateballScores" ? "gb" : "ac"),
    ),
    country,
    region: regionOf(country, said.region),
    notes:
      said.notes === undefined || said.notes === null
        ? undefined
        : TournamentNotes.from(said.notes),
    handicap: said.handicap,
    drawsAllowed: said.drawsAllowed,
    worldRankings: said.worldRankings,
    national: said.national,
    international: said.international,
  };
};

// The creating of the tournament a stream begins with, as the stream says it
// was created: made by the tournament itself, so that what the stream holds is
// only ever what a tournament could have recorded.
const creationOf = (world: SpecWorld, said: Said): DomainEvent => {
  const scenario = scenarioOf(world);
  const tournament = Tournament.create(
    scenario.id,
    websiteOf(said),
    detailsOf(said),
    () => false,
    creatorOf(world),
    now(world),
  );
  const [created] = tournament.handOver();
  assert.ok(created !== undefined, "Creating the tournament recorded nothing.");
  return created;
};

/** That the stream begins by creating a tournament as `said` says. */
export const createdAs = (world: SpecWorld, said: Said): void => {
  scenarioOf(world).created = said;
};

/** That the tournament the stream begins with was created as `said` says too. */
export const createdAlso = (world: SpecWorld, said: Said): void => {
  const scenario = scenarioOf(world);
  assert.ok(scenario.created !== undefined, "No stream has been begun.");
  scenario.created = { ...scenario.created, ...said };
};

/**
 * That the stream begins by creating a tournament found at `written`: in its
 * year and its sport, and named so that its name makes its slug.
 */
export const createdAt = (world: SpecWorld, written: string): void => {
  const address = TournamentAddress.read(written);
  createdAs(world, {
    sport: address.sport.code,
    starts: `${address.year}-10-03T00:00:00Z`,
    finishes: `${address.year}-10-05T00:00:00Z`,
  });
  assert.equal(
    rebuilt(world).address.toString(),
    written,
    "A tournament created as the Spring Open is not found there.",
  );
};

export const streamOf = (world: SpecWorld): readonly DomainEvent[] => {
  const scenario = scenarioOf(world);
  assert.ok(scenario.created !== undefined, "No stream has been begun.");
  return [creationOf(world, scenario.created), ...scenario.later];
};

const rebuilt = (world: SpecWorld): Tournament =>
  Tournament.rebuiltFrom(scenarioOf(world).id, streamOf(world));

/** The tournament rebuilt from the stream, which the scenario looks at next. */
export const rebuild = (world: SpecWorld): void => {
  world.aggregate = rebuilt(world);
};

/**
 * That `happening` happened to the tournament after everything the stream
 * holds already: done to the tournament the stream leaves, so that it records
 * what a tournament would have.
 */
export const happened = (
  world: SpecWorld,
  happening: (tournament: Tournament) => void,
): void => {
  const tournament = rebuilt(world);
  happening(tournament);
  scenarioOf(world).later.push(...tournament.handOver());
};

/**
 * That the event `making` makes of the tournament the stream leaves happened
 * after everything the stream holds already: for what no request to the
 * tournament would record just so, such as a competition moved to an order
 * the scenario names.
 */
export const happenedAs = (
  world: SpecWorld,
  making: (tournament: Tournament) => DomainEvent,
): void => {
  scenarioOf(world).later.push(making(rebuilt(world)));
};

export const tournamentOf = (world: SpecWorld): Tournament => {
  assert.ok(
    world.aggregate instanceof Tournament,
    `There is no tournament: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// Asking a tournament something may be refused, and the scenario says whether
// it expects that, so a refusal is kept rather than thrown.
export const ask = (
  world: SpecWorld,
  asking: (tournament: Tournament) => void,
): void => {
  const tournament = tournamentOf(world);
  try {
    asking(tournament);
  } catch (failure) {
    world.failure = failure;
  }
};

/**
 * What `tournament` is, said again with `changed`. What an update says of the
 * world rankings is what the tournament was created saying of them, and left
 * unsaid when it was created without saying, so that whether it counts is
 * decided again by the update as it was by creating it.
 */
export const updateOf = (
  world: SpecWorld,
  tournament: Tournament,
  changed: Said,
): TournamentDetails => {
  const worldRankings = scenarioOf(world).created?.worldRankings;
  const said: TournamentDetails = {
    name: tournament.name,
    starts: tournament.starts,
    finishes: tournament.finishes,
    format: tournament.format,
    sport: tournament.sport,
    country: tournament.country,
    region: tournament.region.code,
    notes: tournament.notes,
    handicap: tournament.handicap,
    drawsAllowed: tournament.drawsAllowed,
    worldRankings:
      worldRankings === undefined ? undefined : tournament.worldRankings,
    national: tournament.national,
    international: tournament.international,
  };
  return {
    ...said,
    ...(changed.name === undefined
      ? {}
      : { name: TournamentName.from(changed.name) }),
    ...(changed.starts === undefined ? {} : { starts: at(changed.starts) }),
    ...(changed.finishes === undefined
      ? {}
      : { finishes: at(changed.finishes) }),
    ...(changed.format === undefined
      ? {}
      : { format: TournamentFormat.from(changed.format) }),
    ...(changed.sport === undefined
      ? {}
      : { sport: Sport.from(changed.sport) }),
    ...(changed.region === undefined ? {} : { region: changed.region }),
    ...(changed.notes === undefined || changed.notes === null
      ? {}
      : { notes: TournamentNotes.from(changed.notes) }),
    ...(changed.handicap === undefined ? {} : { handicap: changed.handicap }),
    ...(changed.drawsAllowed === undefined
      ? {}
      : { drawsAllowed: changed.drawsAllowed }),
    ...(changed.international === undefined
      ? {}
      : { international: changed.international }),
  };
};

export const playerNamed = (
  tournament: Tournament,
  name: string,
): TournamentPlayer => {
  const found = tournament.players.find(
    (player) => player.name.toString() === name,
  );
  assert.ok(
    found !== undefined,
    `The tournament has no player ${name}: ${inspect(tournament.players.map(String))}`,
  );
  return found;
};

export const competitionNamed = (
  tournament: Tournament,
  name: string,
): CompetitionInTournament => {
  const found = tournament.competitions.find(
    ({ reference }) => reference.name.toString() === name,
  );
  assert.ok(
    found !== undefined,
    `The tournament has no competition ${name}: ${inspect(tournament.competitions.map(({ reference }) => String(reference)))}`,
  );
  return found;
};

/** The id a scenario gave a competition to be added, or a new one. */
export const competitionIdOf = (world: SpecWorld): CompetitionId => {
  const said = scenarioOf(world).competition.id;
  return said === undefined ? CompetitionId.create() : CompetitionId.from(said);
};

// A knockout a scenario adds without saying how is a draw of four places, each
// round the best of 1.
const A_DRAW = { places: 4, rounds: [1, 1] };

/**
 * The draw a scenario gave, or `otherwise` when it gave none. A draw given its
 * places and not its rounds has every round the best of 1.
 */
export const drawOf = (
  world: SpecWorld,
  otherwise: KnockoutDraw = KnockoutDraw.from(A_DRAW.places, A_DRAW.rounds),
): KnockoutDraw => {
  const { drawPlaces, drawRounds } = scenarioOf(world);
  if (drawPlaces === undefined) return otherwise;
  const rounds =
    drawRounds.length > 0
      ? drawRounds
      : Array.from({ length: Math.log2(drawPlaces) }, () => 1);
  return KnockoutDraw.from(drawPlaces, rounds);
};

/** A draw of `places` places, each round the best of 1. */
export const drawOfPlaces = (places: number): KnockoutDraw =>
  KnockoutDraw.from(
    places,
    Array.from({ length: Math.log2(places) }, () => 1),
  );

// The thing the tournament recorded at `index`, the first being 0, which has
// to be of the kind `kind`.
export const assertRecordedAt = <T extends DomainEvent>(
  world: SpecWorld,
  index: number,
  kind: abstract new (...args: never[]) => T,
): T => {
  const event = tournamentOf(world).recorded[index];
  assert.ok(event !== undefined, `It recorded nothing at ${String(index)}.`);
  assert.ok(event instanceof kind, `It recorded ${inspect(event)}.`);
  return event;
};

// The first thing the tournament recorded, which has to be of the kind `kind`.
export const assertFirstRecorded = <T extends DomainEvent>(
  world: SpecWorld,
  kind: abstract new (...args: never[]) => T,
): T => assertRecordedAt(world, 0, kind);

// What the scenario's update says a block's name is, and what it is the best
// of, and otherwise what `found` is already: for a knockout, which is the best
// of something in each round and not overall, the best of 1.
export const nameAndBestOf = (
  world: SpecWorld,
  found: CompetitionInTournament | undefined,
): { name: CompetitionName; bestOf: BestOf } => {
  const changed = scenarioOf(world).competitionUpdate;
  const bestOf =
    found !== undefined && found.shape.kind !== "knockout"
      ? found.shape.bestOf.games
      : 1;
  return {
    name: CompetitionName.from(
      changed.name ?? found?.reference.name.toString() ?? "Block A",
    ),
    bestOf: BestOf.from(changed.bestOf ?? bestOf),
  };
};
