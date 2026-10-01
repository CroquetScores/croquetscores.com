import { Given, Then, When } from "@cucumber/cucumber";

import { TeamPlayerArchived } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  hasPlayed,
  teamNamed,
  teamPlayerNamed,
  teamScenarioOf,
} from "../aTeamTournament.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

// Whatever asks for the player to be archived says whether they have played
// any games, since the games are not the tournament's to know.
Given(
  "the player {string} of the team {string} has played games",
  function (this: SpecWorld, name: string, team: string) {
    teamScenarioOf(this).teamPlayersWithGames.add(`${team}/${name}`);
  },
);

Given(
  "the player {string} of the team {string} has played no games",
  function (this: SpecWorld, name: string, team: string) {
    teamScenarioOf(this).teamPlayersWithGames.delete(`${team}/${name}`);
  },
);

When(
  "the player {string} of the team {string} is archived",
  function (this: SpecWorld, name: string, team: string) {
    ask(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.archiveTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        hasPlayed(this, team, name),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is archived by their id",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.archiveTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.from(id),
        false,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} of the team {string} is archived by their ids",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.archiveTeamPlayer(
        TeamId.from(team),
        TeamPlayerId.from(id),
        false,
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player in a team being archived",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamPlayerArchived);
  },
);
