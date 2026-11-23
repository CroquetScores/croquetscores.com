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

/** An association croquet player as the site keeps them, archived or not. */
export interface KeptAssociationCroquetPlayer {
  /** The site's own, which stays the player's when the rankings change the number. */
  readonly id: string;
  /** The number the rankings give them, which can change. */
  readonly worldRankingId: number;
  readonly name: string;
  readonly changedAt: ReadOnlyDate;
  /** Empty for a player the rankings still list. */
  readonly archivedAt: ReadOnlyDate | undefined;
}

/**
 * Where the association croquet players are read whole, for an app that lists
 * them (worldRankingPlayers.feature, through the API that lists them).
 */
export interface AssociationCroquetPlayersKept {
  /**
   * Every player kept, archived or not, in the order of their names, and
   * only those that changed after `changedSince` where one is given.
   */
  changedAfter(
    changedSince: ReadOnlyDate | undefined,
  ): Promise<readonly KeptAssociationCroquetPlayer[]>;
}

/** One game of an association croquet world ranking player, told from their side. */
export interface KeptWorldRankingPlayerGame {
  readonly id: string;
  readonly tournamentId: string;
  readonly competitionId: string;
  /** Nobody won a drawn game, whichever of the two was typed as the winner. */
  readonly won: boolean;
  readonly score: string;
  readonly opponentScore: string;
  /** Empty where the opponent is not a world ranking player. */
  readonly opponentId: string | undefined;
  /** As the rankings name the opponent where they know them, else as the tournament does. */
  readonly opponentName: string;
  readonly drawn: boolean;
  readonly archived: boolean;
  readonly withdrawn: boolean;
  /** Empty for a game kept before the moment it was added was. */
  readonly addedAt: ReadOnlyDate | undefined;
  readonly changedAt: ReadOnlyDate;
}

/**
 * Where an association croquet world ranking player's games are read, for an
 * app that lists them (worldRankingPlayerGames.feature, through the API that
 * lists them). Read from the read models and never from the events.
 */
export interface WorldRankingPlayerGamesKept {
  /**
   * The games of the player the site gave `playerId`, archived and withdrawn
   * ones too, in the order their competitions last changed and then the order
   * they were added in, and only those that changed after `changedSince`
   * where one is given. Nothing where the site has no such player, which is
   * not the same as a player with no games.
   */
  changedAfter(
    playerId: string,
    changedSince: ReadOnlyDate | undefined,
  ): Promise<readonly KeptWorldRankingPlayerGame[] | undefined>;
}
