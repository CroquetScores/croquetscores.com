import type { CompetitionId } from "../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { TournamentPlayerId } from "../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { KnockoutDraw } from "../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";

/**
 * Whether games have been played, which some of what can be done to a
 * tournament depends on and the tournament does not know: games are played in
 * its competitions. Each answer is yes or no. What to do about it is the
 * tournament's to say.
 */
export interface Games {
  /** Whether `player` has played any games in `tournament`. */
  hasPlayed(
    tournament: TournamentId,
    player: TournamentPlayerId,
  ): Promise<boolean>;

  /** Whether `competition` in `tournament` has any games. */
  hasGames(
    tournament: TournamentId,
    competition: CompetitionId,
  ): Promise<boolean>;

  /**
   * Whether changing the knockout `competition` in `tournament` to a draw of
   * `draw`'s shape moves a player who has played in it.
   */
  movesAPlayerWhoHasPlayed(
    tournament: TournamentId,
    competition: CompetitionId,
    draw: KnockoutDraw,
  ): Promise<boolean>;
}

/**
 * The application's games, until something records them. There is nothing to
 * find, so nobody has played, no competition has any games, and no change to a
 * draw moves anybody who has played. Whatever records games replaces this, and
 * is held to the same questions.
 */
export const noGamesYet: Games = {
  hasPlayed: () => Promise.resolve(false),
  hasGames: () => Promise.resolve(false),
  movesAPlayerWhoHasPlayed: () => Promise.resolve(false),
};
