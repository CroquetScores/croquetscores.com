import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type {
  AssociationCroquetPlayer,
  WorldRankingSport,
} from "./WorldRankingLists.js";

/**
 * Where the players the world rankings know are kept, a sport's apart from
 * the other's (PostgresWorldRankingPlayers.feature).
 *
 * Kept rather than projected: they are the rankings' and not the site's, so
 * nothing records them as events.
 */
export interface WorldRankingPlayers {
  /**
   * Lets go of every golf croquet player kept and keeps `names`, each once.
   * Done in the transaction underway, and after any other replacing rather
   * than alongside it.
   */
  replaceGolfCroquet(names: readonly string[]): Promise<void>;

  /**
   * Keeps `players` as association croquet's list now has them, at `at`: one
   * not kept before is added, one whose name has changed is renamed, one
   * archived and listed again is no longer archived, and one kept and no
   * longer listed is archived, unless it already was. Nobody is let go of,
   * since the site has met them. Done in the transaction underway, and after
   * any other keeping rather than alongside it.
   */
  keepAssociationCroquet(
    players: readonly AssociationCroquetPlayer[],
    at: ReadOnlyDate,
  ): Promise<void>;
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
