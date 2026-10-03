import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a tournament's player can be refused where it is asked. */
export type PublicPlayerOfTournamentRefusedCode =
  "PublicPlayerOfTournament.NotText";

/** Another player, as a player's page names them and leads to them. */
export interface Opponent {
  /** What the tournament calls them now. */
  readonly name: string;
  /** Where their page is found, as "2026/ac/spring-open/players/alex-another". */
  readonly address: string;
}

/** One of a player's games, as they played it. */
export interface GameOfPlayer {
  /** Whether the player beat their opponent, lost to them, or drew with them. */
  readonly result: "won" | "lost" | "drawn";
  readonly opponent: Opponent;
  /** The player's score and their opponent's, each as it was typed. */
  readonly score: string;
  readonly opponentScore: string;
  readonly competition: CompetitionOfTournament;
  readonly addedAt: ReadOnlyDate;
}

/** A player as their page shows them, and the tournament it is a section of. */
export interface PlayerToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The tournament's competitions in use, in its order, for its sections. */
  readonly competitions: readonly CompetitionOfTournament[];
  readonly player: {
    /** What the tournament calls them now. */
    readonly name: string;
  };
  /** Every game of theirs in use, the most recently added first. */
  readonly games: readonly GameOfPlayer[];
  /**
   * Every competition in use they are entered in, in reverse of the
   * tournament's order.
   */
  readonly entered: readonly CompetitionOfTournament[];
}

/**
 * The player found by `slug` in the tournament of the website being read found
 * at `address`, now or before, as their page shows them. For anybody, so it
 * names nobody.
 *
 * A tournament played by teams has no players' pages, and is refused as
 * `PublicPlayerOfTournament.PlayedByTeams`. A slug no player of the tournament
 * has, or an archived player's, is refused as
 * `PublicPlayerOfTournament.NoSuchPlayer`, and an address no tournament of the
 * website has been found at, or an archived tournament's, as
 * `PublicPlayerOfTournament.NoSuchTournament`.
 */
export class PublicPlayerOfTournament extends Query<PlayerToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
    /** The player's slug, as "sam-someone". */
    readonly slug: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<PublicPlayerOfTournamentRefusedCode>(
        "PublicPlayerOfTournament.NotText",
      );
    }
  }
}
