// What the rankings file asks of the read models beyond what every page of a
// tournament asks (`tournamentPages.ts`): the days it is played, where, which
// of its competitions count towards the world rankings, and what the world
// rankings call each player (PublicRankingsOfTournament.feature). The application names
// what it asks; the infrastructure keeps the answer.
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** A competition in use, as the rankings take it. */
export interface CompetitionToRank {
  readonly id: string;
  readonly name: string;
  readonly kind: "block" | "swiss" | "knockout" | "test";
  /** Whether it counts towards the world rankings, as it says for itself. */
  readonly worldRankings: boolean;
  /** When anything was last kept of it, which a game kept with no time falls back to. */
  readonly changedAt: ReadOnlyDate;
}

/** What the rankings of a tournament are made of, besides its games. */
export interface TournamentToRank {
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  /** By code, as "au", and the region's, which is nothing where it has none. */
  readonly country: string;
  readonly region: string | undefined;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionToRank[];
  /**
   * Each player by the id a game names them by, which is a tournament player's
   * and a team player's, to the name the world rankings know them by, which is
   * their name where none was given.
   */
  readonly names: ReadonlyMap<string, string>;
}

export interface TournamentRankings {
  /** The tournament `tournament`, or nothing where there is none. */
  tournament(tournament: string): Promise<TournamentToRank | undefined>;
}
