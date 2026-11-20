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
}

/** A competition as its own page knows it, and as it is played. */
export interface CompetitionOfPage {
  readonly id: string;
  readonly name: string;
  readonly kind: "block" | "swiss" | "knockout" | "test";
  /** A block's and a Swiss's, nothing for a knockout or a test. */
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
}
