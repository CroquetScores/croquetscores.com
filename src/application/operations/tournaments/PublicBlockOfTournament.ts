import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { PublicPlayer } from "./PublicPlayersOfTournament.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
  CommentaryChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's block can be refused where it is asked. */
export type PublicBlockOfTournamentRefusedCode =
  "PublicBlockOfTournament.NotText";

/** A player entered in a block, as its grid shows them, and their totals. */
export interface PlayerOfBlock extends PublicPlayer {
  /** What the block's games name them by. */
  readonly id: string;
  readonly withdrawn: boolean;
  /** The matches they have won, and the match wins they carry forward. */
  readonly matchesWon: number;
  /**
   * The matches their opponents have won against them, and the match losses
   * they carry forward.
   */
  readonly matchesLost: number;
  /** The games they have won, and the game wins they carry forward. */
  readonly gamesWon: number;
  /**
   * The games they have won less the games they have lost, with what they
   * carry forward of each.
   */
  readonly netGames: number;
  /**
   * The points they have scored less the points scored against them, with the
   * hoops for and against they carry forward.
   */
  readonly netHoops: number;
}

/** One of a block's games, its scores as they were typed. */
export interface GameOfBlock {
  /** The id of the player who won it, as a player of the block has it. */
  readonly winner: string;
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserScore: string;
  readonly drawn: boolean;
  /**
   * Whether it was played but counts for nothing: withdrawn itself
   * (`withdrawGame.feature`), or a withdrawn player's
   * (`withdrawPlayer.feature`).
   */
  readonly withdrawn: boolean;
  /** When it was added, or nothing where that was never kept. */
  readonly addedAt: ReadOnlyDate | undefined;
}

/** A block as its page shows it, and the tournament it is a section of. */
export interface BlockToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
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
  readonly block: {
    readonly name: string;
    /** How many games each match between two of its players is the best of. */
    readonly bestOf: number;
  };
  /** Every player entered in it, withdrawn or not, in the block's order. */
  readonly players: readonly PlayerOfBlock[];
  /**
   * Every game of it in use, withdrawn ones among them, in the order they
   * were added.
   */
  readonly games: readonly GameOfBlock[];
  /**
   * The ids of its players ranked: the greater share of their decided
   * matches won first, then the more net hoops, then in the block's order.
   */
  readonly ranked: readonly string[];
}

/**
 * The block found by `slug` in the tournament of the website being read found
 * at `address`, now or before, as its page shows it. For anybody, so it names
 * nobody.
 *
 * A knockout or a Swiss is refused as `PublicBlockOfTournament.NotABlock`. A
 * slug no competition of the tournament has, or an archived competition's, is
 * refused as `PublicBlockOfTournament.NoSuchCompetition`, and an address no
 * tournament of the website has been found at, or an archived tournament's,
 * as `PublicBlockOfTournament.NoSuchTournament`.
 */
export class PublicBlockOfTournament extends Query<BlockToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
    /** The block's slug, as "block-a". */
    readonly slug: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<PublicBlockOfTournamentRefusedCode>(
        "PublicBlockOfTournament.NotText",
      );
    }
  }
}
