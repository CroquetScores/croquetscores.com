// What the public pages of a tournament ask of the read models, so that a page
// asks the events nothing (TournamentPages.feature). The application names what
// it asks; the infrastructure keeps the answer.
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** A tournament as every page of it knows it. */
export interface TournamentOfPage {
  readonly id: string;
  /** The host of the website it is on. */
  readonly website: string;
  readonly name: string;
  /** In Markdown, or nothing where it has none. */
  readonly subtitle: string | undefined;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  readonly archived: boolean;
  /** By its code, as "ac". */
  readonly sport: string;
  /** The competitions in use, in its order, for its section bar. */
  readonly competitions: readonly CompetitionOfTournament[];
  /**
   * By its name, as "Teams", which says whether it is played by teams, or
   * nothing where the read models were made before it was kept: only the pages
   * that need it refuse for want of it.
   */
  readonly format: string | undefined;
  /** Whether a test level on matches is drawn and not decided by nets. */
  readonly levelTestsDrawn: boolean;
}

/** A competition as its own page knows it, and as it is played. */
export interface CompetitionOfPage {
  readonly id: string;
  readonly name: string;
  readonly kind: "block" | "swiss" | "knockout" | "test";
  /** A block's, a Swiss's and a test's, nothing for a knockout. */
  readonly bestOf: number | undefined;
  /** A block's, nothing for any other. */
  readonly rounds: number | undefined;
  /** A block's, by its code. */
  readonly tieBreak: string | undefined;
  /**
   * The most hoops a game is played to, which is null for no most and nothing
   * where it was never said, which is the usual for the tournament's sport.
   */
  readonly maximumHoops: number | null | undefined;
  readonly advantage: boolean;
  /** A test's two teams, the first first, and nothing for any other. */
  readonly teams:
    { readonly first: string; readonly second: string } | undefined;
}

/** A team of a tournament played by teams, as a page counts and shows it. */
export interface TeamOfPage {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly archived: boolean;
}

/** A game of a test, who won and lost it named by the team players' ids. */
export interface GameOfTestOfPage {
  readonly winner: string;
  readonly loser: string;
  /** Each score as it was typed, such as "26tp". */
  readonly winnerScore: string;
  readonly loserScore: string;
  readonly drawn: boolean;
}

/** A test in use, with the games that count: those not archived. */
export interface TestOfPage {
  readonly id: string;
  readonly firstTeam: string;
  readonly secondTeam: string;
  readonly bestOf: number;
  /** How many matches it is expected to have. */
  readonly expectedMatches: number;
  /** The slug of its group, nothing where it is in none or its group makes none. */
  readonly group: string | undefined;
  /** In the order they were added. */
  readonly games: readonly GameOfTestOfPage[];
}

/** What the teams' standings are counted from, of a tournament played by teams. */
export interface TeamsToStand {
  /** Every team, archived ones among them, in the tournament's order. */
  readonly teams: readonly TeamOfPage[];
  /** The team each team player plays for, archived players among them. */
  readonly teamOf: ReadonlyMap<string, string>;
  /** Every test in use, in the tournament's order. */
  readonly tests: readonly TestOfPage[];
}

/** A player entered in a competition, as a page shows them. */
export interface PlayerOfPage {
  /** What the competition's games name them by. */
  readonly entryId: string;
  /** What the tournament keeps them by, which never changes. */
  readonly playerId: string;
  readonly name: string;
  readonly representing: string | undefined;
  readonly handicap: string | undefined;
  readonly flag: string | undefined;
  /** What finds them within the tournament. */
  readonly slug: string;
  readonly withdrawn: boolean;
}

export interface TournamentPages {
  /** The tournament `id`, or nothing where there is none. */
  tournament(id: string): Promise<TournamentOfPage | undefined>;

  /**
   * The competition of the tournament `tournament` found by `slug`, or nothing
   * where it has none in use: an archived one is none, since a reader is not
   * sent to it.
   */
  competition(
    tournament: string,
    slug: string,
  ): Promise<CompetitionOfPage | undefined>;

  /** The players entered in `competition`, in its order, withdrawn last. */
  playersOf(competition: string): Promise<readonly PlayerOfPage[]>;

  /** What the teams of the tournament `tournament` are counted from. */
  teamsToStand(tournament: string): Promise<TeamsToStand>;

  /** The team `id`, or nothing where there is none. */
  team(id: string): Promise<TeamOfPage | undefined>;
}
