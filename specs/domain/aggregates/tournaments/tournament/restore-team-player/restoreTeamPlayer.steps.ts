import { Given, Then, When } from "@cucumber/cucumber";

import { TeamPlayerRestored } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed, teamPlayerNamed } from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
} from "../aTournament.js";

Given(
  "the player {string} of the team {string} was restored",
  function (this: SpecWorld, name: string, team: string) {
    happened(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.restoreTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is restored",
  function (this: SpecWorld, name: string, team: string) {
    ask(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.restoreTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is restored by their id",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.restoreTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.from(id),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} of the team {string} is restored by their ids",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.restoreTeamPlayer(
        TeamId.from(team),
        TeamPlayerId.from(id),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player in a team being restored",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamPlayerRestored);
  },
);
