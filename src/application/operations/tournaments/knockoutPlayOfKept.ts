// A knockout's play worked out of what the read models keep of it, as the
// Competition aggregate works it out of its events: the same domain objects,
// built from rows, run through the same `knockoutPlay`. It is here so that the
// games told to apps (`gamesToTell.ts`) and the knockout's page
// (`PublicKnockoutOfTournamentHandler.ts`) cannot say two different things
// about who played whom in which round.
import { CompetitionPlayer } from "../../../domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import {
  Game,
  gamePlayerIdFrom,
} from "../../../domain/aggregates/tournaments/competitions/Game.js";
import {
  knockoutPlay,
  type Match,
} from "../../../domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import { CompetitionPlayerId } from "../../../domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { KnockoutDraw } from "../../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { GameKept, GamesKept } from "./competitionGames.js";

// A game as the domain keeps it, which is what a knockout's play is worked out
// of. Only who played it matters there, so the scores are not the game's: a
// score as typed is parsed by `Score.kept`, and a score the parser cannot read
// would fail a page that has no use for it.
const gameOf = (kept: GameKept): Game =>
  Game.from(
    GameId.from(kept.id),
    {
      winner: gamePlayerIdFrom(kept.winner),
      winnerScore: Score.kept("1", false),
      loser: gamePlayerIdFrom(kept.loser),
      loserScore: Score.kept("0", false),
    },
    { drawsAllowed: true },
  );

/**
 * The players of a knockout in the competition's order, byes among them and
 * those who withdrew last, as the draw's places are filled from them.
 */
export const playersOfKept = (kept: GamesKept): readonly CompetitionPlayer[] =>
  [
    ...kept.entries.map((entry) => {
      const player = CompetitionPlayer.from(
        CompetitionPlayerId.from(entry.id),
        {
          tournamentPlayerId: TournamentPlayerId.from(entry.tournamentPlayerId),
          order: entry.order,
        },
      );
      return entry.withdrawn ? player.withdraw() : player;
    }),
    ...kept.byes.map((order) =>
      CompetitionPlayer.from(CompetitionPlayerId.bye(), {
        tournamentPlayerId: TournamentPlayerId.bye(),
        order,
      }),
    ),
  ].sort((one, other) => one.order - other.order);

/**
 * Every match of a knockout, first round first, played out by the games that
 * count; none where it has no draw kept, as a competition that is not a
 * knockout has not.
 */
export const matchesOfKept = (kept: GamesKept): readonly Match[] => {
  const { draw } = kept;
  if (draw === undefined) return [];
  const players = playersOfKept(kept);
  // A player who withdraws is put after every other, so those withdrawn are in
  // the order they withdrew in, which is the order they are in.
  const withdrawals = players
    .filter((player) => player.withdrawn && !player.isBye)
    .map((player) => player.id);
  const counting = kept.games
    .filter((game) => !game.archived && !game.withdrawn)
    .map(gameOf);
  return knockoutPlay(
    KnockoutDraw.from(draw.places, draw.rounds),
    players,
    withdrawals,
    counting,
    draw.placedByOrder,
  );
};
