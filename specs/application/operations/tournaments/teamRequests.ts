import { AddTeam } from "../../../../src/application/operations/tournaments/AddTeam.js";
import { AddTeamPlayer } from "../../../../src/application/operations/tournaments/AddTeamPlayer.js";
import { AddTest } from "../../../../src/application/operations/tournaments/AddTest.js";
import { ArchiveTeam } from "../../../../src/application/operations/tournaments/ArchiveTeam.js";
import { ArchiveTeamPlayer } from "../../../../src/application/operations/tournaments/ArchiveTeamPlayer.js";
import { MoveTeam } from "../../../../src/application/operations/tournaments/MoveTeam.js";
import { MoveTeamPlayer } from "../../../../src/application/operations/tournaments/MoveTeamPlayer.js";
import { RestoreTeam } from "../../../../src/application/operations/tournaments/RestoreTeam.js";
import { RestoreTeamPlayer } from "../../../../src/application/operations/tournaments/RestoreTeamPlayer.js";
import type { TestRequest } from "../../../../src/application/operations/tournaments/testOperations.js";
import { UpdateTeam } from "../../../../src/application/operations/tournaments/UpdateTeam.js";
import { UpdateTeamPlayer } from "../../../../src/application/operations/tournaments/UpdateTeamPlayer.js";
import { UpdateTest } from "../../../../src/application/operations/tournaments/UpdateTest.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  dayOf,
  teamScenarioOf,
  teamToAdd,
  teamUpdateOf,
  testNamed,
} from "../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import { scenarioOf as domainScenarioOf } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import { accountFor, heldAccount, momentOf, send } from "./aRequest.js";
import type { About } from "./requests.js";

// Each operation on a tournament's teams, their players and its tests, sent
// as the account `account` — the one the session would name — about what the
// scenario names. What a request is to carry is said in the words the
// domain's features use, so it is read from where the domain's steps keep it.

/**
 * The account the reader is signed in to, as the session names it: the one
 * for `address`, or the one the scenario took hold of where it names none.
 */
export const readerOf = async (
  world: SpecWorld,
  address: string | undefined,
): Promise<string> =>
  address === undefined
    ? heldAccount(world)
    : (await accountFor(world, address)).value;

const found = async (
  world: SpecWorld,
  tournament: About,
): Promise<Tournament | undefined> => world.tournamentsInHand?.load(tournament);

/**
 * A team's id where the tournament has one called `name`, and one that names
 * nothing where it has not, or where there is no tournament.
 */
export const teamIn = async (
  world: SpecWorld,
  tournament: About,
  name: string | undefined,
): Promise<TeamId> =>
  (name === undefined
    ? undefined
    : (await found(world, tournament))?.teams.find(
        (team) => team.name.toString() === name,
      )?.id) ?? TeamId.create();

/**
 * The id of the player called `name` of the team called `team`, and one that
 * names nobody where there is no such player.
 */
export const teamPlayerIn = async (
  world: SpecWorld,
  tournament: About,
  team: string,
  name: string | undefined,
): Promise<TeamPlayerId> =>
  (name === undefined
    ? undefined
    : (await found(world, tournament))?.teams
        .find((each) => each.name.toString() === team)
        ?.players.find((player) => player.name.toString() === name)?.id) ??
  TeamPlayerId.create();

/** A test's id where the tournament has one called `name`, and otherwise one naming nothing. */
export const testIn = async (
  world: SpecWorld,
  tournament: About,
  name: string | undefined,
): Promise<CompetitionId> => {
  const tournamentFound = await found(world, tournament);
  if (name === undefined || tournamentFound === undefined) {
    return CompetitionId.create();
  }
  return testNamed(tournamentFound, name).reference.id;
};

export const addTeam = (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string,
): Promise<void> =>
  send(
    world,
    new AddTeam(
      account,
      tournament.value,
      teamToAdd(world, name).details,
      momentOf(world),
    ),
    tournament,
  );

export const updateTeam = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> => {
  const id = await teamIn(world, tournament, name);
  const team = (await found(world, tournament))?.teams.find((each) =>
    each.id.equals(id),
  );
  await send(
    world,
    new UpdateTeam(
      account,
      tournament.value,
      id.value,
      teamUpdateOf(world, team),
      momentOf(world),
    ),
    tournament,
  );
};

export const archiveTeam = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> =>
  send(
    world,
    new ArchiveTeam(
      account,
      tournament.value,
      (await teamIn(world, tournament, name)).value,
      momentOf(world),
    ),
    tournament,
  );

export const restoreTeam = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
): Promise<void> =>
  send(
    world,
    new RestoreTeam(
      account,
      tournament.value,
      (await teamIn(world, tournament, name)).value,
      momentOf(world),
    ),
    tournament,
  );

export const moveTeam = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
  direction: string,
): Promise<void> =>
  send(
    world,
    new MoveTeam(
      account,
      tournament.value,
      (await teamIn(world, tournament, name)).value,
      direction,
      momentOf(world),
    ),
    tournament,
  );

export const addTeamPlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  team: string | undefined,
  name: string,
): Promise<void> =>
  send(
    world,
    new AddTeamPlayer(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      { name },
      momentOf(world),
    ),
    tournament,
  );

export const updateTeamPlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  team: string,
  name: string | undefined,
): Promise<void> =>
  send(
    world,
    new UpdateTeamPlayer(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      (await teamPlayerIn(world, tournament, team, name)).value,
      {
        name:
          domainScenarioOf(world).playerUpdate.name ?? name ?? "Sam Someone",
      },
      momentOf(world),
    ),
    tournament,
  );

export const archiveTeamPlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  team: string,
  name: string | undefined,
): Promise<void> =>
  send(
    world,
    new ArchiveTeamPlayer(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      (await teamPlayerIn(world, tournament, team, name)).value,
      momentOf(world),
    ),
    tournament,
  );

export const restoreTeamPlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  team: string,
  name: string | undefined,
): Promise<void> =>
  send(
    world,
    new RestoreTeamPlayer(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      (await teamPlayerIn(world, tournament, team, name)).value,
      momentOf(world),
    ),
    tournament,
  );

export const moveTeamPlayer = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  team: string,
  name: string | undefined,
  direction: string,
): Promise<void> =>
  send(
    world,
    new MoveTeamPlayer(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      (await teamPlayerIn(world, tournament, team, name)).value,
      direction,
      momentOf(world),
    ),
    tournament,
  );

/**
 * The request to add a test between the teams called `first` and `second`,
 * each left unchosen where it is nothing: what the scenario said of the test,
 * and otherwise played on the tournament's first day, expected to have 1
 * match, each the best of 1, in no group.
 */
export const testRequestFor = async (
  world: SpecWorld,
  tournament: About,
  first: string | undefined,
  second: string | undefined,
): Promise<TestRequest> => {
  const said = teamScenarioOf(world).test;
  const tournamentFound = await found(world, tournament);
  const firstDay =
    tournamentFound === undefined
      ? "2026-10-03"
      : dayOf(tournamentFound.starts);
  const group = said.group ?? undefined;
  return {
    firstTeam:
      first === undefined
        ? undefined
        : (await teamIn(world, tournament, first)).value,
    secondTeam:
      second === undefined
        ? undefined
        : (await teamIn(world, tournament, second)).value,
    starts: said.starts ?? firstDay,
    finishes: said.finishes ?? said.starts ?? firstDay,
    expectedMatches: said.expectedMatches ?? 1,
    bestOf: said.bestOf ?? 1,
    ...(group === undefined ? {} : { group }),
  };
};

export const addTest = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  first: string | undefined,
  second: string | undefined,
): Promise<void> =>
  send(
    world,
    new AddTest(
      account,
      tournament.value,
      await testRequestFor(world, tournament, first, second),
      momentOf(world),
    ),
    tournament,
  );

/**
 * The request to update the test called `name`: everything it is, said again
 * with what the scenario's update changes, its second team left unchosen
 * where `withoutSecondTeam` is so.
 */
export const updateTest = async (
  world: SpecWorld,
  account: string,
  tournament: About,
  name: string | undefined,
  { withoutSecondTeam = false }: { readonly withoutSecondTeam?: boolean } = {},
): Promise<void> => {
  const tournamentFound = await found(world, tournament);
  const test =
    name === undefined || tournamentFound === undefined
      ? undefined
      : testNamed(tournamentFound, name);
  const changed = teamScenarioOf(world).testUpdate;
  const shape = test?.shape;
  const team = async (
    named: string | undefined,
    kept: TeamId | undefined,
  ): Promise<string> =>
    named === undefined
      ? (kept ?? TeamId.create()).value
      : (await teamIn(world, tournament, named)).value;
  const group =
    changed.group === undefined
      ? shape?.group?.toString()
      : (changed.group ?? undefined);
  await send(
    world,
    new UpdateTest(
      account,
      tournament.value,
      (test?.reference.id ?? CompetitionId.create()).value,
      {
        firstTeam: await team(changed.firstTeam, shape?.firstTeam),
        secondTeam: withoutSecondTeam
          ? undefined
          : await team(changed.secondTeam, shape?.secondTeam),
        starts:
          changed.starts ??
          (shape === undefined ? "2026-10-03" : dayOf(shape.starts)),
        finishes:
          changed.finishes ??
          (shape === undefined ? "2026-10-03" : dayOf(shape.finishes)),
        expectedMatches:
          changed.expectedMatches ?? shape?.expectedMatches.count ?? 1,
        bestOf: changed.bestOf ?? shape?.bestOf.games ?? 1,
        ...(group === undefined ? {} : { group }),
      },
      momentOf(world),
    ),
    tournament,
  );
};
