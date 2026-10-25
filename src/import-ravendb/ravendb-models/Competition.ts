import type { Reference } from "./Tournament.js";
/**
 * A player as the old sites kept one in a competition: numbered from 1 within
 * the competition, with the name and what they represented as the competition
 * has them. The old sites copied a tournament's players into each competition
 * and let a manager change the copy, so the tournament's own list says
 * nothing of who a competition's player is, and the import does not read it.
 */
export interface OldPlayer {
  readonly _Id: number;
  readonly Name: string;
  readonly Representing: string | null;
}

/** What a player carried into a competition, each count 0 unless a manager typed another. */
export interface CarryForward {
  readonly MatchWins: number;
  readonly MatchLosses: number;
  readonly GameWins: number;
  readonly GameLosses: number;
  readonly ForHoops: number;
  readonly AgainstHoops: number;
}

/** A tournament's player as entered in one competition, under their number in the tournament. */
export interface CompetitionPlayer extends OldPlayer {
  readonly CarryForward: CarryForward;
  readonly IsWithdrawn: boolean;
}

/** One player's side of a game: who, and the score as it was typed, such as "26tp". */
export interface Result {
  readonly PlayerId: number;
  readonly Score: { readonly _Score: string };
}

export interface Game {
  /** Numbered from 1 within its competition, in the order the games were entered. */
  readonly Id: number;
  readonly Winner: Result;
  readonly Loser: Result;
  /** As Newtonsoft wrote a `DateTime`, with no zone. */
  readonly CreatedAt: string;
}

/**
 * What every competition the old sites kept stores, as far as importing one
 * reads it: a `Block`, a `Knockout`, a `Swiss` or a `TeamMatch`.
 */
export interface Competition {
  readonly Tournament: Reference;
  readonly Name: string;
  /**
   * Where it was on the old site under its tournament's address, after
   * "competition/". Not read by every scenario's document, so not always there.
   */
  readonly Slug?: string | null;
  /** Kept as objects holding the lists, as Newtonsoft wrote them. */
  readonly Players: { readonly _Players: readonly CompetitionPlayer[] };
  readonly Games: { readonly _Games: readonly Game[] };
  readonly IsArchived: boolean;
  /**
   * Not kept by the old sites: set by the import, to what it is called as a
   * kind of competition, "block" or "knockout", where it is to be brought over
   * whole or not at all, because its games are kept in a Swiss where it
   * cannot be (ImportWholeTournaments.feature).
   */
  readonly AllOrNothingAs?: string;
}

/** A competition where every player meets every other. */
export interface Block extends Competition {
  /** What each match is the best of, 1 unless it is played as matches. */
  readonly BestOf: number;
}

/**
 * A competition where losing puts a player out, drawn in the order its
 * players are listed. Byes are the tournament's player called "Bye".
 */
export interface Knockout extends Competition {
  /** How many places its first round has, byes among them. */
  readonly Size: number;
}

/** A competition where each round pairs players on similar records. */
export interface Swiss extends Competition {
  /**
   * The earlier competitions whose games it counted as its own, which the
   * old sites showed in its standings. Not there where it named none.
   */
  readonly CarryForwardCompetitions?: readonly Reference[] | null;
}

/**
 * A match between two teams, named "Team A vs Team B". A player is on the
 * team they represent.
 */
export interface TeamMatch extends Competition {
  /** The days it was played, each midnight with no zone. */
  readonly Start: string;
  readonly Finish: string;
  readonly ExpectedMatches: number;
  readonly BestOf: number;
  readonly Group: string | null;
}
