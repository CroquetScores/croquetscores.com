import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a tournament's games can be refused where it is asked. */
export type GamesOfTournamentRefusedCode = "GamesOfTournament.NotText";

/** A player as a game shows them. */
export interface PlayerInGame {
  /** What the tournament calls them now. */
  readonly name: string;
  /** What they represent, or nothing where they represent nothing. */
  readonly representing?: string | undefined;
  /** The name of the flag they fly, or nothing where they fly none. */
  readonly flag?: string | undefined;
}

/** One of a tournament's games, as its page shows it. */
export interface GameOfTournament {
  readonly winner: PlayerInGame;
  /** Each score as it was typed, as "26tp". */
  readonly winnerScore: string;
  readonly loser: PlayerInGame;
  readonly loserScore: string;
  /** Whether it is on equal points with no mark, and so won by neither. */
  readonly drawn: boolean;
  readonly competition: CompetitionOfTournament;
  readonly addedAt: ReadOnlyDate;
}

/** A tournament as its page shows it: what it is, its sections, its games. */
export interface TournamentGames {
  readonly name: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /**
   * Whether it is played by teams, whose players are their teams' and have
   * no players' page of the tournament's own.
   */
  readonly playedByTeams: boolean;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  /** Every game in use, the most recently added first. */
  readonly games: readonly GameOfTournament[];
}

/**
 * The games of the tournament of the website being read found at `address`,
 * now or before, as its page shows them. For anybody, so it names nobody.
 *
 * An address no tournament of the website has been found at is refused as
 * `GamesOfTournament.NoSuchTournament`, and so is an archived tournament's,
 * since an archived tournament is not one a reader is sent to.
 */
export class GamesOfTournament extends Query<TournamentGames> {
  constructor(
    readonly website: string,
    /** Where it is found, as "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<GamesOfTournamentRefusedCode>(
        "GamesOfTournament.NotText",
      );
    }
  }
}
