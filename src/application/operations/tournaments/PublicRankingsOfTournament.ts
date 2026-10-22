import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a tournament's rankings can be refused where it is asked. */
export type PublicRankingsOfTournamentRefusedCode =
  "PublicRankingsOfTournament.NotText";

/** One game of a result, each side's score as it was typed. */
export interface GameOfRanking {
  /** The score of the result's winner, who may have lost this game. */
  readonly winnerScore: string;
  readonly loserScore: string;
  /** Whether the result's winner won this game, as they do not always. */
  readonly wonByWinner: boolean;
}

/**
 * What the rankings are sent as one line saying somebody beat somebody: a game
 * of a block, a Swiss or a test, which is one game, or a match of a knockout,
 * which is the games it was played in, the match's winner first in each.
 */
export interface ResultOfRanking {
  /** By their world ranking name, which is their name where none was given. */
  readonly winner: string;
  readonly loser: string;
  /** In the order they were played. */
  readonly games: readonly GameOfRanking[];
}

/** A competition of the tournament that has a result. */
export interface CompetitionOfRanking {
  readonly name: string;
  readonly results: readonly ResultOfRanking[];
}

/**
 * Why a tournament has no rankings, the first that applies: its sport is not
 * ranked, or none of its competitions counts towards them, whether because its
 * manager has said so or because each is played under handicap or allows drawn
 * games.
 */
export type WhyNoRankings = "sport" | "notCounted";

/** A tournament's rankings: what is sent, or why there is nothing to send. */
export interface RankingsToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The sport's code, as "ac". */
  readonly sport: string;
  /** The name of the country it is played in, as "Australia". */
  readonly country: string;
  /**
   * Whether it is played by teams, whose competitions are tests between them,
   * so that who won one is not a player's to be.
   */
  readonly playedByTeams: boolean;
  /** The days it starts and finishes on, each as "2026-10-03". */
  readonly starts: string;
  readonly finishes: string;
  readonly rankings:
    | {
        readonly is: "available";
        /** Those with a result, in the tournament's order. */
        readonly competitions: readonly CompetitionOfRanking[];
        /**
         * How many competitions the tournament has in use, whether or not
         * they have a result, since the file names a competition only where
         * there is more than one to tell apart.
         */
        readonly competitionCount: number;
      }
    | { readonly is: "not available"; readonly because: WhyNoRankings };
}

/**
 * The rankings of the tournament of the website being read found at
 * `address`, now or before: its results where it counts towards the world
 * rankings, and why it does not where it does not, rather than a refusal,
 * since the page that says why is as much an answer. For anybody, so it names
 * nobody.
 *
 * An address no tournament of the website has been found at, or an archived
 * tournament's, is refused as `PublicRankingsOfTournament.NoSuchTournament`.
 */
export class PublicRankingsOfTournament extends Query<RankingsToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<PublicRankingsOfTournamentRefusedCode>(
        "PublicRankingsOfTournament.NotText",
      );
    }
  }
}
