import { Given, Then, When } from "@cucumber/cucumber";

import { TeamPlayerUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { TeamPlayer } from "../../../../../../src/domain/aggregates/tournaments/TeamPlayer.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed, teamPlayerNamed } from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
  scenarioOf,
} from "../aTournament.js";

// What `player` is called, said again as the scenario's update says, in the
// words a tournament's player is updated in (`updatePlayer.feature`).
const updateOf = (
  world: SpecWorld,
  player: TeamPlayer | undefined,
): { name: string } => ({
  name:
    scenarioOf(world).playerUpdate.name ??
    player?.name.toString() ??
    "Sam Someone",
});

Given(
  "the player {string} of the team {string} was updated to be called {string}",
  function (this: SpecWorld, name: string, team: string, called: string) {
    happened(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.updateTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        { name: called },
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is updated",
  function (this: SpecWorld, name: string, team: string) {
    ask(this, (tournament) => {
      const found = teamNamed(tournament, team);
      const player = teamPlayerNamed(found, name);
      tournament.updateTeamPlayer(
        found.id,
        player.id,
        updateOf(this, player),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is updated by their id",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.updateTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.from(id),
        updateOf(this, undefined),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} of the team {string} is updated by their ids",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.updateTeamPlayer(
        TeamId.from(team),
        TeamPlayerId.from(id),
        updateOf(this, undefined),
        byOf(this),
        now(this),
      ),
    );
  },
);

// One team's player, asked of another team, which does not have them.
When(
  "the player {string} of the team {string} is updated as a player of the team {string}",
  function (this: SpecWorld, name: string, team: string, asOf: string) {
    ask(this, (tournament) => {
      const player = teamPlayerNamed(teamNamed(tournament, team), name);
      tournament.updateTeamPlayer(
        teamNamed(tournament, asOf).id,
        player.id,
        updateOf(this, player),
        byOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a player in a team being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamPlayerUpdated);
  },
);
