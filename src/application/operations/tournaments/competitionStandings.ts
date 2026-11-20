// What the site's pages and the public API ask of the read models that keep the
// standings of blocks and Swisses, so that neither works them out again from
// the competition (CompetitionStandings.feature). The application names what
// it asks; the infrastructure keeps the answer.
import type { CarryForwardCounts } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";

/** One player's line of the standings of a block or a Swiss, as it is kept. */
export interface StandingKept {
  /** The id the competition gives the player, which its games name them by. */
  readonly entryId: string;
  /** Where they are shown, the first being 1, those who have withdrawn last. */
  readonly rank: number;
  /** Matches decided in a block, and games played in a Swiss. */
  readonly played: number;
  /** Matches won in a block, and games won in a Swiss. */
  readonly won: number;
  /** Matches lost, in a block only. */
  readonly lost: number | undefined;
  /** Games won, in a block only. */
  readonly gamesWon: number | undefined;
  /** Games won less games lost, in a block only. */
  readonly netGames: number | undefined;
  readonly netHoops: number;
  /** Whether they have withdrawn from the competition. */
  readonly withdrawn: boolean;
  /** Their place, the first being 1, or nothing where they have none. */
  readonly place: number | undefined;
  /** Whether others hold the same place. */
  readonly shared: boolean;
}

/** What is worked out of a competition, to be kept. */
export interface StandingsToKeep {
  readonly standings: readonly StandingKept[];
  /**
   * Whether any two players who have not withdrawn are level on the share of
   * their decided matches they have won: a block's only.
   */
  readonly levelOnMatchesWon: boolean;
}

/** A line as it is read, with the tournament's player it is of. */
export interface StandingRead extends StandingKept {
  readonly tournamentPlayerId: string;
}

/** The standings of a competition as they are read, best first. */
export interface StandingsKept {
  readonly standings: readonly StandingRead[];
  readonly levelOnMatchesWon: boolean;
}

/** A player of a competition, and what is asked of them to stand them. */
export interface EntryToStand {
  readonly id: string;
  readonly withdrawn: boolean;
  /** What they carry forward, nothing where nothing is. */
  readonly carried: CarryForwardCounts;
}

export interface CompetitionStandings {
  /**
   * The standings kept of the competition `competition`: nothing is kept of
   * one that is not a block or a Swiss, and no line for a player who is not
   * there.
   */
  standingsKept(competition: string): Promise<StandingsKept>;
}
