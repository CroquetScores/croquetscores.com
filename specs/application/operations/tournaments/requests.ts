import { AddBlock } from "../../../../src/application/operations/tournaments/AddBlock.js";
import {
  AddKnockout,
  type LosersKnockoutSaid,
} from "../../../../src/application/operations/tournaments/AddKnockout.js";
import { AddManager } from "../../../../src/application/operations/tournaments/AddManager.js";
import { AddPlayer } from "../../../../src/application/operations/tournaments/AddPlayer.js";
import { AddPlayers } from "../../../../src/application/operations/tournaments/AddPlayers.js";
import { AddScorer } from "../../../../src/application/operations/tournaments/AddScorer.js";
import { AddSwiss } from "../../../../src/application/operations/tournaments/AddSwiss.js";
import { ArchiveCompetition } from "../../../../src/application/operations/tournaments/ArchiveCompetition.js";
import { MoveCompetition } from "../../../../src/application/operations/tournaments/MoveCompetition.js";
import { ArchivePlayer } from "../../../../src/application/operations/tournaments/ArchivePlayer.js";
import { ArchiveTournament } from "../../../../src/application/operations/tournaments/ArchiveTournament.js";
import {
  type CreatedTournament,
  CreateTournament,
} from "../../../../src/application/operations/tournaments/CreateTournament.js";
import { RemoveManager } from "../../../../src/application/operations/tournaments/RemoveManager.js";
import { RemoveScorer } from "../../../../src/application/operations/tournaments/RemoveScorer.js";
import { RestoreCompetition } from "../../../../src/application/operations/tournaments/RestoreCompetition.js";
import { RestorePlayer } from "../../../../src/application/operations/tournaments/RestorePlayer.js";
import { RestoreTournament } from "../../../../src/application/operations/tournaments/RestoreTournament.js";
import { UpdateBlock } from "../../../../src/application/operations/tournaments/UpdateBlock.js";
import { UpdateKnockout } from "../../../../src/application/operations/tournaments/UpdateKnockout.js";
import { ChangePlayerWorldRankingName } from "../../../../src/application/operations/tournaments/ChangePlayerWorldRankingName.js";
import { UpdatePlayer } from "../../../../src/application/operations/tournaments/UpdatePlayer.js";
import { UpdateSwiss } from "../../../../src/application/operations/tournaments/UpdateSwiss.js";
import { UpdateTournament } from "../../../../src/application/operations/tournaments/UpdateTournament.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  competitionNamed,
  playerNamed,
  scenarioOf as domainScenarioOf,
} from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  created,
  creationOf,
  load,
  momentOf,
  scenarioOf,
  send,
  updateOf,
} from "./aRequest.js";

// Each operation, sent as the account `account` — the one the session would
// name — about what the scenario names. Whatever came of it is kept on the
// world for the scenario to judge.

// The tournament `name` as the scenario knows it: the one created with that
// name, or, for a request about a tournament there is not, none at all.
export type About = TournamentId;

export const create = async (
  world: SpecWorld,
  account: string,
): Promise<void> => {
  const request = creationOf(world);
  await send(
    world,
    new CreateTournament(
      account,
      scenarioOf(world).website ?? "croquetscores.com",
      request,
      momentOf(world),
    ),
    undefined,
  );
  const answer = world.answer as CreatedTournament | undefined;
  if (answer !== undefined) {
    created(world, answer.id, request.name);
    scenarioOf(world).looking = answer.id;
    world.aggregate = await load(world, answer.id);
  }
};

export const update = async (
  world: SpecWorld,
  account: string,
  tournament: About,
): Promise<void> => {
  const as = await world.tournamentsInHand?.load(tournament);
  const request = as === undefined ? creationOf(world) : updateOf(world, as);
  await send(
    world,
    new UpdateTournament(account, tournament.value, request, momentOf(world)),
    tournament,
  );
};

export const archive = (
  world: SpecWorld,
  account: string,
  tournament: About,
): Promise<void> =>
  send(
    world,
    new ArchiveTournament(account, tournament.value, momentOf(world)),
    tournament,
  );

export const restore = (
  world: SpecWorld,
  account: string,
  tournament: About,
): Promise<void> =>
  send(
    world,
    new RestoreTournament(account, tournament.value, momentOf(world)),
    tournament,
  );

// A player's id where the tournament has a player called `name`, and one
// that names nobody where it has not, or where there is no tournament.
const playerIn = async (
  world: SpecWorld,
  tournament: About,
  name: string | undefined,
): Promise<TournamentPlayerId | undefined> => {
  if (name === undefined) return undefined;
  const found = await world.tournamentsInHand?.load(tournament);
  if (found === undefined) return undefined;
  return playerNamed(found, name).id;
};

export const addPlayer = (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
): Promise<void> => {
  const { representing, flag, worldRankingName } =
    domainScenarioOf(world).player;
  return send(
    world,
    new AddPlayer(
      account,
      tournament.value,
      {
        name,
        ...(representing === undefined ? {} : { representing }),
        ...(flag === undefined ? {} : { flag }),
        ...(worldRankingName === undefined ? {} : { worldRankingName }),
      },
      momentOf(world),
    ),
    tournament,
  );
};

/** Changes the world ranking name of the player `name` of `tournament` alone. */
export const changePlayerWorldRankingName = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
  worldRankingName: string,
): Promise<void> => {
  const id =
    (await playerIn(world, tournament, name)) ?? TournamentPlayerId.create();
  await send(
    world,
    new ChangePlayerWorldRankingName(
      account,
      tournament.value,
      id.value,
      worldRankingName,
      momentOf(world),
    ),
    tournament,
  );
};

export const updatePlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id =
    (await playerIn(world, tournament, name)) ?? TournamentPlayerId.create();
  const found = await world.tournamentsInHand?.load(tournament);
  const player = found?.players.find((each) => each.id.equals(id));
  const changed = domainScenarioOf(world).playerUpdate;
  const representing = changed.representing ?? player?.representing;
  const flag =
    changed.flag ??
    (player?.flag === undefined ? undefined : String(player.flag));
  const worldRankingName =
    changed.worldRankingName ?? player?.worldRankingName?.toString();
  await send(
    world,
    new UpdatePlayer(
      account,
      tournament.value,
      id.value,
      {
        name: changed.name ?? player?.name.toString() ?? name ?? "Sam Someone",
        ...(representing === undefined ? {} : { representing }),
        ...(flag === undefined ? {} : { flag }),
        ...(worldRankingName === undefined ? {} : { worldRankingName }),
      },
      momentOf(world),
    ),
    tournament,
  );
};

export const archivePlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id =
    (await playerIn(world, tournament, name)) ?? TournamentPlayerId.create();
  await send(
    world,
    new ArchivePlayer(account, tournament.value, id.value, momentOf(world)),
    tournament,
  );
};

export const restorePlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id =
    (await playerIn(world, tournament, name)) ?? TournamentPlayerId.create();
  await send(
    world,
    new RestorePlayer(account, tournament.value, id.value, momentOf(world)),
    tournament,
  );
};

// A competition's id where the tournament has one called `name`, and one that
// names nothing where it has not, or where there is no tournament.
export const competitionIn = async (
  world: SpecWorld,
  tournament: About,
  name: string | undefined,
): Promise<CompetitionId> => {
  if (name === undefined) return CompetitionId.create();
  const found = await world.tournamentsInHand?.load(tournament);
  if (found === undefined) return CompetitionId.create();
  return competitionNamed(found, name).reference.id;
};

export const addBlock = (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
): Promise<void> =>
  send(
    world,
    new AddBlock(
      account,
      tournament.value,
      name,
      domainScenarioOf(world).competition.bestOf ?? 1,
      // Played once, where the scenario says nothing else.
      domainScenarioOf(world).competition.rounds ?? 1,
      momentOf(world),
      domainScenarioOf(world).competition.rules,
    ),
    tournament,
  );

export const addSwiss = (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
): Promise<void> =>
  send(
    world,
    new AddSwiss(
      account,
      tournament.value,
      name,
      domainScenarioOf(world).competition.bestOf ?? 1,
      momentOf(world),
      domainScenarioOf(world).competition.rules,
    ),
    tournament,
  );

// The draw a scenario gives, as typed: its places, and each round's best-of,
// every round the best of 1 where it says none. A knockout the scenario says
// nothing of is a draw of four places, each round the best of 1.
const drawSaid = (
  world: SpecWorld,
): { places: number; rounds: number[] } | undefined => {
  const { drawPlaces, drawRounds } = domainScenarioOf(world);
  if (drawPlaces === undefined) return undefined;
  return {
    places: drawPlaces,
    rounds:
      drawRounds.length > 0
        ? drawRounds
        : Array.from({ length: Math.log2(drawPlaces) }, () => 1),
  };
};

// The losers knockouts a scenario says the knockout is to be added with.
const losersSaid = new WeakMap<SpecWorld, LosersKnockoutSaid[]>();

export const sayLosersKnockout = (
  world: SpecWorld,
  losers: LosersKnockoutSaid,
): void => {
  losersSaid.set(world, [...(losersSaid.get(world) ?? []), losers]);
};

export const addKnockout = (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
): Promise<void> => {
  const draw = drawSaid(world) ?? { places: 4, rounds: [1, 1] };
  return send(
    world,
    new AddKnockout(
      account,
      tournament.value,
      name,
      draw.places,
      draw.rounds,
      momentOf(world),
      domainScenarioOf(world).competition.rules,
      losersSaid.get(world),
    ),
    tournament,
  );
};

// What the scenario's update says a block or a Swiss is, and otherwise what
// the competition called `name` is already.
const bestOfUpdate = async (
  world: SpecWorld,
  tournament: About,
  name: string | undefined,
): Promise<{ id: CompetitionId; name: string; bestOf: number }> => {
  const changed = domainScenarioOf(world).competitionUpdate;
  const found = await world.tournamentsInHand?.load(tournament);
  const competition =
    name === undefined || found === undefined
      ? undefined
      : competitionNamed(found, name);
  const bestOf =
    competition !== undefined && competition.shape.kind !== "knockout"
      ? competition.shape.bestOf.games
      : 1;
  return {
    id: competition?.reference.id ?? CompetitionId.create(),
    name: changed.name ?? name ?? "Block A",
    bestOf: changed.bestOf ?? bestOf,
  };
};

export const updateBlock = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const update = await bestOfUpdate(world, tournament, name);
  await send(
    world,
    new UpdateBlock(
      account,
      tournament.value,
      update.id.value,
      update.name,
      update.bestOf,
      domainScenarioOf(world).competitionUpdate.rounds ?? 1,
      momentOf(world),
      domainScenarioOf(world).competitionUpdate.rules,
    ),
    tournament,
  );
};

export const updateSwiss = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const update = await bestOfUpdate(world, tournament, name);
  await send(
    world,
    new UpdateSwiss(
      account,
      tournament.value,
      update.id.value,
      update.name,
      update.bestOf,
      momentOf(world),
      domainScenarioOf(world).competitionUpdate.rules,
    ),
    tournament,
  );
};

export const updateKnockout = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const found = await world.tournamentsInHand?.load(tournament);
  const competition =
    name === undefined || found === undefined
      ? undefined
      : competitionNamed(found, name);
  const current =
    competition?.shape.kind === "knockout"
      ? {
          places: competition.shape.draw.places,
          rounds: competition.shape.draw.rounds.map((round) => round.games),
        }
      : { places: 4, rounds: [1, 1] };
  const draw = drawSaid(world) ?? current;
  await send(
    world,
    new UpdateKnockout(
      account,
      tournament.value,
      (competition?.reference.id ?? CompetitionId.create()).value,
      domainScenarioOf(world).competitionUpdate.name ?? name ?? "Main Event",
      draw.places,
      draw.rounds,
      momentOf(world),
      domainScenarioOf(world).competitionUpdate.rules,
    ),
    tournament,
  );
};

export const archiveCompetition = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id = await competitionIn(world, tournament, name);
  await send(
    world,
    new ArchiveCompetition(
      account,
      tournament.value,
      id.value,
      momentOf(world),
    ),
    tournament,
  );
};

export const moveCompetition = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
  direction: string,
): Promise<void> => {
  const id = await competitionIn(world, tournament, name);
  await send(
    world,
    new MoveCompetition(
      account,
      tournament.value,
      id.value,
      direction,
      momentOf(world),
    ),
    tournament,
  );
};

export const restoreCompetition = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id = await competitionIn(world, tournament, name);
  await send(
    world,
    new RestoreCompetition(
      account,
      tournament.value,
      id.value,
      momentOf(world),
    ),
    tournament,
  );
};

export const addManager = (
  world: SpecWorld,
  account: string,
  tournament: About,
  address: string,
): Promise<void> =>
  send(
    world,
    new AddManager(account, tournament.value, address, momentOf(world)),
    tournament,
  );

export const addScorer = (
  world: SpecWorld,
  account: string,
  tournament: About,
  address: string,
): Promise<void> =>
  send(
    world,
    new AddScorer(account, tournament.value, address, momentOf(world)),
    tournament,
  );

export const removeManager = (
  world: SpecWorld,
  account: string,
  tournament: About,
  manager: string,
): Promise<void> =>
  send(
    world,
    new RemoveManager(account, tournament.value, manager, momentOf(world)),
    tournament,
  );

export const removeScorer = (
  world: SpecWorld,
  account: string,
  tournament: About,
  scorer: string,
): Promise<void> =>
  send(
    world,
    new RemoveScorer(account, tournament.value, scorer, momentOf(world)),
    tournament,
  );

/**
 * Adds the players the scenario has listed, as the fields it named and the
 * rows it wrote, to `tournament`.
 */
export const addListedPlayers = (
  world: SpecWorld,
  account: string,
  tournament: About,
  fields: readonly string[],
  rows: readonly (readonly string[])[],
): Promise<void> =>
  send(
    world,
    new AddPlayers(account, tournament.value, fields, rows, momentOf(world)),
    tournament,
  );
