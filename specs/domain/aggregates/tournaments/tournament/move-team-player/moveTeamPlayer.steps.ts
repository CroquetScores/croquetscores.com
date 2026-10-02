import { Given, Then, When } from "@cucumber/cucumber";

import { TeamPlayerMoved } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayerMoved.js";
import { TeamPlayersSpacedOut } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayersSpacedOut.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed, teamPlayerNamed } from "../aTeamTournament.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  creatorOf,
  happenedAs,
  now,
} from "../aTournament.js";

When(
  /^the player "([^"]*)" of the team "([^"]*)" is moved (up|down)$/,
  function (
    this: SpecWorld,
    name: string,
    team: string,
    direction: "up" | "down",
  ) {
    ask(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.moveTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        direction,
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} of the team {string} is moved up by their id",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.moveTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.from(id),
        "up",
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} of the team {string} is moved up by their ids",
  function (this: SpecWorld, id: string, team: string) {
    ask(this, (tournament) =>
      tournament.moveTeamPlayer(
        TeamId.from(team),
        TeamPlayerId.from(id),
        "up",
        byOf(this),
        now(this),
      ),
    );
  },
);

// An order no move would give just so, to bring two orders together.
Given(
  "the player {string} of the team {string} was moved to the order {int}",
  function (this: SpecWorld, name: string, team: string, order: number) {
    happenedAs(this, (tournament) => {
      const found = teamNamed(tournament, team);
      return new TeamPlayerMoved(
        found.id.value,
        teamPlayerNamed(found, name).id.value,
        order,
        creatorOf(this),
        now(this),
      );
    });
  },
);

// Every player of the team, in the order the stream leaves them, as the
// tournament says them when it spaces them out.
Given(
  "the players of the team {string} were spaced out",
  function (this: SpecWorld, team: string) {
    happenedAs(this, (tournament) => {
      const found = teamNamed(tournament, team);
      return new TeamPlayersSpacedOut(
        found.id.value,
        found.playersByOrder.map((player) => player.id.value),
        creatorOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a player in a team being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, TeamPlayerMoved);
  },
);

Then(
  "the second thing it recorded is a player in a team being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 1, TeamPlayerMoved);
  },
);

Then(
  "the first thing it recorded is a team's players being spaced out",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, TeamPlayersSpacedOut);
  },
);
