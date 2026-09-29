import { CompetitionPlayerMoved } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerMoved.js";
import { CompetitionPlayersSpacedOut } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayersSpacedOut.js";
import { CompetitionPlayerId } from "../../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import type { PlayerMoves } from "../../../moving-players/movingPlayers.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  happenedAs,
  now,
  playerNamed,
  toldOf,
} from "../aCompetition.js";

// Moving a competition's player, as the steps a tournament's features share
// word for word with a competition's do it (movingPlayers.steps.ts).
export const competitionPlayerMoves: PlayerMoves = {
  moved: (world: SpecWorld, name, direction) => {
    ask(world, (competition) => {
      competition.movePlayer(
        playerNamed(world, competition, name).id,
        direction,
        toldOf(world),
        byOf(world),
        now(world),
      );
    });
  },

  movedById: (world, id) => {
    ask(world, (competition) => {
      competition.movePlayer(
        CompetitionPlayerId.from(id),
        "up",
        toldOf(world),
        byOf(world),
        now(world),
      );
    });
  },

  movedTo: (world, name, order) => {
    happenedAs(
      world,
      (competition) =>
        new CompetitionPlayerMoved(
          playerNamed(world, competition, name).id.value,
          order,
          byOf(world),
          now(world),
        ),
    );
  },

  // Every player, in the order the stream leaves them, as the competition says
  // them when it spaces them out.
  spacedOut: (world) => {
    happenedAs(
      world,
      (competition) =>
        new CompetitionPlayersSpacedOut(
          competition.players.map((player) => player.id.value),
          byOf(world),
          now(world),
        ),
    );
  },

  assertMovedAt: (world, index) => {
    assertRecordedAt(world, index, CompetitionPlayerMoved);
  },

  assertSpacedOutAt: (world, index) => {
    assertRecordedAt(world, index, CompetitionPlayersSpacedOut);
  },
};
