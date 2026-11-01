import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
  CommentaryChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's team summary can be refused where it is asked. */
export type PublicTeamSummaryOfTournamentRefusedCode =
  "PublicTeamSummaryOfTournament.NotText";

/** How one team of a tournament played by teams stands. */
export interface TeamStanding {
  /** What the tournament's games of its players are counted by. */
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly testsWon: number;
  readonly testsLost: number;
  readonly testsDrawn: number;
  /** The matches its players have won and lost, each once it was decided. */
  readonly matchesWon: number;
  readonly matchesLost: number;
  readonly gamesWon: number;
  readonly gamesLost: number;
  /** The points its players scored, and had scored against them. */
  readonly hoopsFor: number;
  readonly hoopsAgainst: number;
}

// Written once, since the summary shows each net and the ranking compares it,
// and the two must not come to differ.
export const netMatchesOf = (team: TeamStanding): number =>
  team.matchesWon - team.matchesLost;
export const netGamesOf = (team: TeamStanding): number =>
  team.gamesWon - team.gamesLost;
export const netHoopsOf = (team: TeamStanding): number =>
  team.hoopsFor - team.hoopsAgainst;

/** How the teams of a tournament played by teams stand, and the tournament. */
export interface TeamSummaryToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-tests". */
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
  /** Always, since only a tournament played by teams has a summary. */
  readonly playedByTeams: true;
  /** The tournament's competitions in use, its tests, for its sections. */
  readonly competitions: readonly CompetitionOfTournament[];
  /** Each team in use, in the tournament's order. */
  readonly teams: readonly TeamStanding[];
  /**
   * Whether any of its tests in use has matches the best of more than 1;
   * where none has, a match is its one game.
   */
  readonly bestOfMoreThanOne: boolean;
  /**
   * The ids of the teams ranked: the more tests won first, then the more
   * matches won, then the more net games, then the more net hoops, then in the
   * tournament's order. A tournament in the Interstate Shield format ranks by
   * the more net matches in place of the matches won, and puts teams still
   * level in order by the tests they won against one another.
   */
  readonly ranked: readonly string[];
  /**
   * Whether the summary shows net matches and net games, which a tournament
   * in the Interstate Shield format does and no other.
   */
  readonly showsNets: boolean;
}

/**
 * How the teams of the tournament of the website being read found at
 * `address`, now or before, stand. For anybody, so it names nobody.
 *
 * A Standard tournament is refused as
 * `PublicTeamSummaryOfTournament.NotPlayedByTeams`, and an address no
 * tournament of the website has been found at, or an archived tournament's,
 * as `PublicTeamSummaryOfTournament.NoSuchTournament`.
 */
export class PublicTeamSummaryOfTournament extends Query<TeamSummaryToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-tests". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<PublicTeamSummaryOfTournamentRefusedCode>(
        "PublicTeamSummaryOfTournament.NotText",
      );
    }
  }
}
