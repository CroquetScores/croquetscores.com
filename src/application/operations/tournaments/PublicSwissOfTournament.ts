import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { GameOfKnockout } from "./PublicKnockoutOfTournament.js";
import type { PublicPlayer } from "./PublicPlayersOfTournament.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
  CommentaryChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's Swiss can be refused where it is asked. */
export type PublicSwissOfTournamentRefusedCode =
  "PublicSwissOfTournament.NotText";

/** One game a player of a Swiss played, as their results say it. */
export interface ResultOfSwiss {
  readonly opponent: {
    /** What the tournament calls them now. */
    readonly name: string;
    /** Where their page is found, as "2026/gc/spring-open/players/alex-another". */
    readonly address: string;
  };
  readonly result: "won" | "lost" | "drawn";
  /** The player's points less their opponent's, below 0 for a game lost. */
  readonly margin: number;
  /**
   * Whether the game was played but counts for nothing
   * (`withdrawGame.feature`), so that nothing the player is answered with
   * counts it.
   */
  readonly withdrawn: boolean;
}

/** A player entered in a Swiss, as its grid shows them. */
export interface PlayerOfSwiss extends PublicPlayer {
  /** What the Swiss's games name them by. */
  readonly id: string;
  readonly withdrawn: boolean;
  /** The games they have played, and the game wins and losses they carry forward. */
  readonly gamesPlayed: number;
  /** The games they have won, and the game wins they carry forward. */
  readonly gamesWon: number;
  /**
   * The points they have scored less the points scored against them, with the
   * hoops for and against they carry forward.
   */
  readonly netHoops: number;
  /** Each game they played, in the order the games were added. */
  readonly results: readonly ResultOfSwiss[];
}

/** One of a Swiss's games, as its order of play shows it. */
export type GameOfSwiss = GameOfKnockout & {
  /** Whether it was played but counts for nothing (`withdrawGame.feature`). */
  readonly withdrawn: boolean;
};

/** A Swiss as its pages show it, and the tournament it is a section of. */
export interface SwissToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/gc/spring-open". */
  readonly address: string;
  /** The tournament's subtitle, in Markdown, or nothing where it has none. */
  readonly subtitle: string | undefined;
  /**
   * Each of the tournament's notes with when it last changed, the most
   * recently written first, for its section bar to mark Notes by.
   */
  readonly managerNotes: readonly ManagerNoteChanged[];
  /**
   * Each of the tournament's commentaries with when it last changed, for its
   * section bar to mark Commentary by.
   */
  readonly commentariesChanged: readonly CommentaryChanged[];
  /** The tournament's competitions in use, in its order, for its sections. */
  readonly competitions: readonly CompetitionOfTournament[];
  readonly swiss: { readonly name: string };
  /** Every player entered in it, withdrawn or not, in the Swiss's order. */
  readonly players: readonly PlayerOfSwiss[];
  /**
   * The ids of its players ranked: the greater share of their games won
   * first, then the more net hoops, then in the Swiss's order, and those who
   * have played no game after all who have.
   */
  readonly ranked: readonly string[];
  /**
   * Every game of it in use, withdrawn ones among them, in the order they
   * were added.
   */
  readonly games: readonly GameOfSwiss[];
}

/**
 * The Swiss found by `slug` in the tournament of the website being read found
 * at `address`, now or before, as its pages show it. For anybody, so it names
 * nobody.
 *
 * A block or a knockout is refused as `PublicSwissOfTournament.NotASwiss`. A
 * slug no competition of the tournament has, or an archived competition's, is
 * refused as `PublicSwissOfTournament.NoSuchCompetition`, and an address no
 * tournament of the website has been found at, or an archived tournament's,
 * as `PublicSwissOfTournament.NoSuchTournament`.
 */
export class PublicSwissOfTournament extends Query<SwissToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/gc/spring-open". */
    readonly address: string,
    /** The Swiss's slug, as "zed". */
    readonly slug: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<PublicSwissOfTournamentRefusedCode>(
        "PublicSwissOfTournament.NotText",
      );
    }
  }
}
