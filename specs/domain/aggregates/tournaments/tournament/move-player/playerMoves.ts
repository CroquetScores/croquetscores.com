import { TournamentPlayerMoved } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerMoved.js";
import { TournamentPlayersSpacedOut } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayersSpacedOut.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { PlayerMoves } from "../../moving-players/movingPlayers.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  creatorOf,
  happenedAs,
  now,
  playerNamed,
} from "../aTournament.js";

// Moving a tournament's player, as the steps a tournament's features share
// word for word with a competition's do it (movingPlayers.steps.ts).
export const tournamentPlayerMoves: PlayerMoves = {
  moved: (world, name, direction) => {
    ask(world, (tournament) => {
      tournament.movePlayer(
        playerNamed(tournament, name).id,
        direction,
        byOf(world),
        now(world),
      );
    });
  },

  movedById: (world, id) => {
    ask(world, (tournament) => {
      tournament.movePlayer(
        TournamentPlayerId.from(id),
        "up",
        byOf(world),
        now(world),
      );
    });
  },

  movedTo: (world, name, order) => {
    happenedAs(
      world,
      (tournament) =>
        new TournamentPlayerMoved(
          playerNamed(tournament, name).id.value,
          order,
          creatorOf(world),
          now(world),
        ),
    );
  },

  // Every player, in the order the stream leaves them, as the tournament says
  // them when it spaces them out.
  spacedOut: (world) => {
    happenedAs(
      world,
      (tournament) =>
        new TournamentPlayersSpacedOut(
          tournament.players.map((player) => player.id.value),
          creatorOf(world),
          now(world),
        ),
    );
  },

  assertMovedAt: (world, index) => {
    assertRecordedAt(world, index, TournamentPlayerMoved);
  },

  assertSpacedOutAt: (world, index) => {
    assertRecordedAt(world, index, TournamentPlayersSpacedOut);
  },
};
