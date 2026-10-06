import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  GameOfKnockout,
  WhichSide,
} from "./PublicKnockoutOfTournament.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's test can be refused where it is asked. */
export type PublicTestOfTournamentRefusedCode =
  "PublicTestOfTournament.NotText";

/** One game of a match of a test, its scores as typed, the first side's first. */
export interface GameOfTestMatch {
  readonly scores: readonly [string, string];
  /** The side that won it, or nothing where it was drawn. */
  readonly winner: WhichSide | undefined;
}

/**
 * A match of a test, between a player of each team: its first side always the
 * first team's player, and its second the second team's.
 */
export interface MatchOfTest {
  /** Each side's player by their name. */
  readonly sides: readonly [string, string];
  /** Its games in use, oldest first. */
  readonly games: readonly GameOfTestMatch[];
  /** The side that won it once decided; nothing before, or where it was shared. */
  readonly winner: WhichSide | undefined;
}

/** One team of a test, and what its players have in it. */
export interface TeamOfTest {
  readonly name: string;
  readonly shortName: string;
  /** The matches its players have won in the test, each once it is decided. */
  readonly matches: number;
  /** The games its players have won in the test. */
  readonly games: number;
  /** The points its players have scored in the test. */
  readonly hoops: number;
}

/** One of a test's games, as its order of play shows it. */
export type GameOfTest = GameOfKnockout;

/** A test as its pages show it, and the tournament it is a section of. */
export interface TestToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-tests". */
  readonly address: string;
  /** The tournament's notes, in Markdown, or nothing where it has none. */
  readonly notes: string | undefined;
  /**
   * Each of the tournament's notes with when it last changed, the most
   * recently written first, for its section bar to mark Notes by.
   */
  readonly managerNotes: readonly ManagerNoteChanged[];
  /** Always, since only a tournament played by teams has tests. */
  readonly playedByTeams: true;
  /** The tournament's competitions in use, its tests, for its sections. */
  readonly competitions: readonly CompetitionOfTournament[];
  readonly test: {
    readonly teams: readonly [TeamOfTest, TeamOfTest];
    /** How many games each of its matches is the best of. */
    readonly bestOf: number;
  };
  /** Each match played, in the order its first game was added. */
  readonly matches: readonly MatchOfTest[];
  /** Every game of it in use, in the order they were added. */
  readonly games: readonly GameOfTest[];
}

/**
 * The test found by `slug` in the tournament of the website being read found
 * at `address`, now or before, as its pages show it. For anybody, so it names
 * nobody.
 *
 * A block, a knockout or a Swiss is refused as `PublicTestOfTournament.NotATest`.
 * A slug no competition of the tournament has, or an archived competition's,
 * is refused as `PublicTestOfTournament.NoSuchCompetition`, and an address no
 * tournament of the website has been found at, or an archived tournament's,
 * as `PublicTestOfTournament.NoSuchTournament`.
 */
export class PublicTestOfTournament extends Query<TestToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-tests". */
    readonly address: string,
    /** The test's slug, as "aus-v-eng". */
    readonly slug: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<PublicTestOfTournamentRefusedCode>(
        "PublicTestOfTournament.NotText",
      );
    }
  }
}
