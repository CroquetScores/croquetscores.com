import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Command } from "../../../../src/application/common/Command.js";
import { AddTeam } from "../../../../src/application/operations/tournaments/AddTeam.js";
import { AddTeamPlayer } from "../../../../src/application/operations/tournaments/AddTeamPlayer.js";
import { AddTest } from "../../../../src/application/operations/tournaments/AddTest.js";
import { ArchiveTeam } from "../../../../src/application/operations/tournaments/ArchiveTeam.js";
import { ArchiveTeamPlayer } from "../../../../src/application/operations/tournaments/ArchiveTeamPlayer.js";
import { MoveTeam } from "../../../../src/application/operations/tournaments/MoveTeam.js";
import { MoveTeamPlayer } from "../../../../src/application/operations/tournaments/MoveTeamPlayer.js";
import { RestoreTeam } from "../../../../src/application/operations/tournaments/RestoreTeam.js";
import { RestoreTeamPlayer } from "../../../../src/application/operations/tournaments/RestoreTeamPlayer.js";
import { UpdateTeamPlayer } from "../../../../src/application/operations/tournaments/UpdateTeamPlayer.js";
import { UpdateTest } from "../../../../src/application/operations/tournaments/UpdateTest.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentFormat } from "../../../../src/domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  dayOf,
  teamNamed,
  teamPlayerNamed,
  teamToAdd,
  testNamed,
} from "../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import { tournamentOf } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  accountFor,
  inHandOf,
  load,
  lookAt,
  momentOf,
  tournamentNamed,
} from "./aRequest.js";
import { teamIn, teamPlayerIn, testRequestFor } from "./teamRequests.js";

// The steps more than one of the operations on a tournament played by teams
// uses: what was done before the request the scenario is about, and what the
// tournament is afterwards. Each operation's own steps are beside its
// feature, in the folder named for it.

// What was done before ---------------------------------------------------------

// The format the next tournament the scenario creates is played in.
Given(
  "the tournament is to be played in the format {string}",
  function (this: SpecWorld, name: string) {
    this.tournamentFormat = TournamentFormat.from(name);
  },
);

// Done to the tournament `name` as the account for `address`, and not
// refused: a scenario that says it was done is not about whether it could be.
const doneTo = async (
  world: SpecWorld,
  address: string,
  name: string,
  making: (
    account: string,
    tournament: TournamentId,
  ) => Promise<Command<unknown>>,
): Promise<void> => {
  const account = (await accountFor(world, address)).value;
  const tournament = tournamentNamed(world, name);
  await inHandOf(world).send(await making(account, tournament));
  await lookAt(world, tournament);
};

// Its short name and its flag as the scenario said the next team's are, as
// adding one in the scenario's own request does.
Given(
  "{string} has added the team {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddTeam(
          account,
          tournament.value,
          teamToAdd(this, team).details,
          momentOf(this),
        ),
      ),
    );
  },
);

Given(
  "{string} has archived the team {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
  ) {
    await doneTo(
      this,
      address,
      name,
      async (account, tournament) =>
        new ArchiveTeam(
          account,
          tournament.value,
          (await teamIn(this, tournament, team)).value,
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has restored the team {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
  ) {
    await doneTo(
      this,
      address,
      name,
      async (account, tournament) =>
        new RestoreTeam(
          account,
          tournament.value,
          (await teamIn(this, tournament, team)).value,
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has moved the team {string} in {string} up",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
  ) {
    await doneTo(
      this,
      address,
      name,
      async (account, tournament) =>
        new MoveTeam(
          account,
          tournament.value,
          (await teamIn(this, tournament, team)).value,
          "up",
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has added the player {string} to the team {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
  ) {
    await doneTo(
      this,
      address,
      name,
      async (account, tournament) =>
        new AddTeamPlayer(
          account,
          tournament.value,
          (await teamIn(this, tournament, team)).value,
          { name: player },
          momentOf(this),
        ),
    );
  },
);

// Something done to the player `player` of the team `team`, made by `making`
// of the ids of the team and the player.
const doneToTeamPlayer = (
  world: SpecWorld,
  address: string,
  player: string,
  team: string,
  name: string,
  making: (
    account: string,
    tournament: string,
    teamId: string,
    playerId: string,
  ) => Command<unknown>,
): Promise<void> =>
  doneTo(world, address, name, async (account, tournament) =>
    making(
      account,
      tournament.value,
      (await teamIn(world, tournament, team)).value,
      (await teamPlayerIn(world, tournament, team, player)).value,
    ),
  );

Given(
  "{string} has archived the player {string} of the team {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
  ) {
    await doneToTeamPlayer(
      this,
      address,
      player,
      team,
      name,
      (account, tournament, teamId, playerId) =>
        new ArchiveTeamPlayer(
          account,
          tournament,
          teamId,
          playerId,
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has restored the player {string} of the team {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
  ) {
    await doneToTeamPlayer(
      this,
      address,
      player,
      team,
      name,
      (account, tournament, teamId, playerId) =>
        new RestoreTeamPlayer(
          account,
          tournament,
          teamId,
          playerId,
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has moved the player {string} of the team {string} of {string} up",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
  ) {
    await doneToTeamPlayer(
      this,
      address,
      player,
      team,
      name,
      (account, tournament, teamId, playerId) =>
        new MoveTeamPlayer(
          account,
          tournament,
          teamId,
          playerId,
          "up",
          momentOf(this),
        ),
    );
  },
);

Given(
  "{string} has renamed the player {string} of the team {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    team: string,
    name: string,
    renamed: string,
  ) {
    await doneToTeamPlayer(
      this,
      address,
      player,
      team,
      name,
      (account, tournament, teamId, playerId) =>
        new UpdateTeamPlayer(
          account,
          tournament,
          teamId,
          playerId,
          { name: renamed },
          momentOf(this),
        ),
    );
  },
);

// Played as the scenario said the next test is to be, as adding one in the
// scenario's own request is.
Given(
  "{string} has added the test between {string} and {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    first: string,
    second: string,
    name: string,
  ) {
    await doneTo(
      this,
      address,
      name,
      async (account, tournament) =>
        new AddTest(
          account,
          tournament.value,
          await testRequestFor(this, tournament, first, second),
          momentOf(this),
        ),
    );
  },
);

// The test `test`, said again as it is with `changed`.
const testChanged = (
  world: SpecWorld,
  address: string,
  test: string,
  name: string,
  changed: { readonly expectedMatches?: number; readonly bestOf?: number },
): Promise<void> =>
  doneTo(world, address, name, async (account, tournament) => {
    const { reference, shape } = testNamed(await load(world, tournament), test);
    const group = shape.group?.toString();
    return new UpdateTest(
      account,
      tournament.value,
      reference.id.value,
      {
        firstTeam: shape.firstTeam.value,
        secondTeam: shape.secondTeam.value,
        starts: dayOf(shape.starts),
        finishes: dayOf(shape.finishes),
        expectedMatches: shape.expectedMatches.count,
        bestOf: shape.bestOf.games,
        ...(group === undefined ? {} : { group }),
        ...changed,
      },
      momentOf(world),
    );
  });

Given(
  "{string} has given the test {string} of {string} {int} expected matches",
  async function (
    this: SpecWorld,
    address: string,
    test: string,
    name: string,
    count: number,
  ) {
    await testChanged(this, address, test, name, { expectedMatches: count });
  },
);

Given(
  "{string} has given the test {string} of {string} matches each the best of {int}",
  async function (
    this: SpecWorld,
    address: string,
    test: string,
    name: string,
    games: number,
  ) {
    await testChanged(this, address, test, name, { bestOf: games });
  },
);

// What came of it --------------------------------------------------------------

Then(
  "it is answered with the id of the tournament's team {string}",
  function (this: SpecWorld, name: string) {
    const id = teamNamed(tournamentOf(this), name).id;
    assert.ok(
      id.equals(this.answer as typeof id),
      `It was answered with ${String(this.answer)}.`,
    );
  },
);

Then(
  "it is answered with the id of the player {string} of the team {string}",
  function (this: SpecWorld, name: string, team: string) {
    const id = teamPlayerNamed(teamNamed(tournamentOf(this), team), name).id;
    assert.ok(
      id.equals(this.answer as typeof id),
      `It was answered with ${String(this.answer)}.`,
    );
  },
);

Then("the tournament has no teams", function (this: SpecWorld) {
  assert.deepEqual(tournamentOf(this).teams.map(String), []);
});

// The competition's own stream, read back: a test added has none until
// something is done to it, and so no games.
Then(
  "the competition {string} of {string} has no games",
  async function (this: SpecWorld, competition: string, name: string) {
    const tournament = await load(this, tournamentNamed(this, name));
    const { reference } = testNamed(tournament, competition);
    const kept = await inHandOf(this).loadCompetition(reference.id);
    assert.deepEqual(kept?.games ?? [], []);
  },
);

Then(
  "the competition {string} of {string} has the game of {string} beating {string} {int} to {int}",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    winner: string,
    loser: string,
    winnerScore: number,
    loserScore: number,
  ) {
    const tournament = await load(this, tournamentNamed(this, name));
    const { reference } = testNamed(tournament, competition);
    const players = tournament.teams.flatMap((team) => team.players);
    const idOf = (called: string) =>
      players.find((player) => player.name.toString() === called)?.id;
    const kept = await inHandOf(this).loadCompetition(reference.id);
    assert.ok(
      (kept?.games ?? []).some(
        (game) =>
          game.winner.equals(idOf(winner)) &&
          game.loser.equals(idOf(loser)) &&
          String(game.winnerScore) === String(winnerScore) &&
          String(game.loserScore) === String(loserScore),
      ),
      `${competition} has no game of ${winner} beating ${loser} ${String(winnerScore)} to ${String(loserScore)}.`,
    );
  },
);
