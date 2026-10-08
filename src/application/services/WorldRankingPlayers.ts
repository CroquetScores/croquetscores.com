import type { WorldRankingSport } from "./WorldRankingLists.js";

/**
 * Where the players the world rankings know are kept, by their full names, a
 * sport's apart from the other's (PostgresWorldRankingPlayers.feature).
 *
 * Kept rather than projected: they are the rankings' and not the site's, so
 * nothing records them as events, and an import replaces them whole.
 */
export interface WorldRankingPlayers {
  /**
   * Lets go of every player kept for `sport` and keeps `names`, each once.
   * Done in the transaction underway, and after any other replacing of the
   * same sport's players rather than alongside it.
   */
  replace(sport: WorldRankingSport, names: readonly string[]): Promise<void>;
}

/**
 * Where the players the world rankings know are found by their names, as the
 * player dialogs ask for them (WorldRankingPlayersMatching.feature).
 */
export interface WorldRankingPlayerNames {
  /**
   * The names of `sport`'s players in which `typed` begins a word, whatever
   * its case, in alphabetical order, no more than `most` of them. A space or
   * a hyphen begins a word, and no character in `typed` stands for another.
   */
  beginning(
    sport: WorldRankingSport,
    typed: string,
    most: number,
  ): Promise<readonly string[]>;

  /** Whether `name` is one of `sport`'s players, spelled exactly so. */
  has(sport: WorldRankingSport, name: string): Promise<boolean>;
}
