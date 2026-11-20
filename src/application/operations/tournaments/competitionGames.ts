// What the public API asks of the read models that keep the games of
// competitions, so that it asks the events nothing (CompetitionGames.feature).
// The application names what it asks; the infrastructure keeps the answer.
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** One game of a competition, as it is kept, archived or not. */
export interface GameKept {
  readonly id: string;
  /** Who won it, by the id the competition gives its players, or a team player's in a test. */
  readonly winner: string;
  /** Each score as it was typed, such as "26tp". */
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserScore: string;
  readonly drawn: boolean;
  readonly archived: boolean;
  /** Withdrawn itself: played, but counts for nothing. */
  readonly withdrawn: boolean;
  /** When the game last changed, or nothing where none is held. */
  readonly changedAt: ReadOnlyDate | undefined;
  /**
   * When the game was added, which a change does not move, or nothing for a
   * game kept before it was held.
   */
  readonly addedAt?: ReadOnlyDate | undefined;
}

/** A player of a competition, as it is kept. */
export interface EntryKept {
  readonly id: string;
  readonly tournamentPlayerId: string;
  /** Their order in the competition, lowest first. */
  readonly order: number;
  readonly withdrawn: boolean;
}

/** Who a game names by an id, told as the tournament knows them. */
export interface WhoPlayed {
  /** What the tournament keeps them by, which never changes. */
  readonly playerId: string;
  readonly name: string;
  /** The team they are of, in a test. */
  readonly team: string | undefined;
  /** The name of that team, as a team player is known by their team. */
  readonly teamName?: string | undefined;
  /** The name of the flag that team flies, if any. */
  readonly teamFlag?: string | undefined;
}

/** What is kept of a competition's games, and of what they are played out against. */
export interface GamesKept {
  /** Every game, archived ones among them, in the order they are shown. */
  readonly games: readonly GameKept[];
  readonly entries: readonly EntryKept[];
  /** The order of each of a knockout's byes. */
  readonly byes: readonly number[];
  /** A knockout's draw, and nothing for any other competition. */
  readonly draw:
    | {
        readonly places: number;
        /** The games each round is the best of. */
        readonly rounds: readonly number[];
        /** Whether its players are put in their places by another knockout. */
        readonly placedByOrder: boolean;
      }
    | undefined;
  /** A test's first team, which has the first side of every match. */
  readonly firstTeam: string | undefined;
  /** Each player a game names, by the id it names them by. */
  readonly who: ReadonlyMap<string, WhoPlayed>;
}

export interface CompetitionGames {
  /** What is kept of the games of the competition `competition`. */
  gamesKept(competition: string): Promise<GamesKept>;
}
