import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { PlayerInGame } from "./GamesOfTournament.js";
import type { PublicPlayer } from "./PublicPlayersOfTournament.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a tournament's knockout can be refused where it is asked. */
export type PublicKnockoutOfTournamentRefusedCode =
  "PublicKnockoutOfTournament.NotText";

/** A player drawn in a knockout, as its pages show them. */
export interface PlayerOfKnockout extends PublicPlayer {
  readonly withdrawn: boolean;
}

/**
 * One side of a match: a player; a bye; a place of the first round nobody
 * has been entered in; or a place of a later round not yet known, since the
 * match before it is not yet decided.
 */
export type SideOfKnockout =
  | { readonly is: "player"; readonly player: PlayerOfKnockout }
  | { readonly is: "bye" }
  | { readonly is: "empty" }
  | { readonly is: "not yet known" };

/** Which of a match's two sides, the first being 0. */
export type WhichSide = 0 | 1;

/** One game of a match, its scores as they were typed, each side's in its place. */
export interface GameOfMatch {
  readonly winner: WhichSide;
  readonly scores: readonly [string, string];
}

/** A match of a knockout. */
export interface MatchOfKnockout {
  readonly sides: readonly [SideOfKnockout, SideOfKnockout];
  /** Its games that count, oldest first. */
  readonly games: readonly GameOfMatch[];
  /** The side that goes through, or nothing where the match is not yet decided. */
  readonly winner: WhichSide | undefined;
}

/** A round of a knockout, its matches in the order of the draw. */
export interface RoundOfKnockout {
  /** How many games each of its matches is the best of. */
  readonly bestOf: number;
  readonly matches: readonly MatchOfKnockout[];
}

/** One of a knockout's games, as its order of play shows it. */
export interface GameOfKnockout {
  readonly winner: PlayerInGame;
  /** Each score as it was typed, as "26tp". */
  readonly winnerScore: string;
  readonly loser: PlayerInGame;
  readonly loserScore: string;
  /** Never, since a knockout allows no drawn games, but said as every game is. */
  readonly drawn: boolean;
  /** When it was added, or nothing where that was never kept. */
  readonly addedAt: ReadOnlyDate | undefined;
}

/** A knockout as its pages show it, and the tournament it is a section of. */
export interface KnockoutToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The tournament's notes, in Markdown, or nothing where it has none. */
  readonly notes: string | undefined;
  /** The tournament's competitions in use, in its order, for its sections. */
  readonly competitions: readonly CompetitionOfTournament[];
  readonly knockout: { readonly name: string };
  /** Its rounds, the first first and the final last. */
  readonly rounds: readonly RoundOfKnockout[];
  /** Every game of it in use, in the order they were added. */
  readonly games: readonly GameOfKnockout[];
}

/**
 * The knockout found by `slug` in the tournament of the website being read
 * found at `address`, now or before, as its pages show it. For anybody, so it
 * names nobody.
 *
 * A block or a Swiss is refused as `PublicKnockoutOfTournament.NotAKnockout`.
 * A slug no competition of the tournament has, or an archived competition's,
 * is refused as `PublicKnockoutOfTournament.NoSuchCompetition`, and an
 * address no tournament of the website has been found at, or an archived
 * tournament's, as `PublicKnockoutOfTournament.NoSuchTournament`.
 */
export class PublicKnockoutOfTournament extends Query<KnockoutToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
    /** The knockout's slug, as "finals". */
    readonly slug: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<PublicKnockoutOfTournamentRefusedCode>(
        "PublicKnockoutOfTournament.NotText",
      );
    }
  }
}
