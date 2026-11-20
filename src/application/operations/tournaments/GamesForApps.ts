import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionHead } from "./competitionForApps.js";

/** Every reason asking for a competition's games can be refused where it is asked. */
export type GamesForAppsRefusedCode = "GamesForApps.NotText";

/** One side of a game: the player, and their score as it was typed, such as "26tp". */
export interface SideOfGameForApps {
  /** What the tournament keeps them by, which never changes. */
  readonly playerId: string;
  readonly name: string;
  readonly score: string;
}

/** One game of a competition. */
export interface GameForApps {
  readonly id: string;
  /** Where the game was drawn, which of the two is called the winner is only the order they were typed. */
  readonly winner: SideOfGameForApps;
  readonly loser: SideOfGameForApps;
  readonly drawn: boolean;
  /** Whether it was played but counts for nothing. */
  readonly withdrawn: boolean;
  /** The round of a knockout it was played in, the first being 1, and nothing in any other competition. */
  readonly round: number | undefined;
  /** When the game was last changed: added, corrected, moved, withdrawn, archived or restored. */
  readonly changedAt: ReadOnlyDate;
}

/** A match of a test between two players, one of each team, and the games of it. */
export interface MatchForApps {
  readonly players: readonly [
    { readonly playerId: string; readonly name: string },
    { readonly playerId: string; readonly name: string },
  ];
  readonly games: readonly GameForApps[];
}

/**
 * The games of a competition: every one of a block, a Swiss or a knockout in
 * the order they were added, and a test's under the match each is in.
 */
export type GamesOfCompetition =
  | { readonly games: readonly GameForApps[] }
  | { readonly matches: readonly MatchForApps[] };

export type GamesToTell = {
  readonly competition: CompetitionHead;
} & GamesOfCompetition;

/**
 * The games of the competition `competition` of the tournament `tournament`,
 * both by id, of the website being read. For anybody, so it names nobody.
 */
export class GamesForApps extends Query<GamesToTell> {
  constructor(
    readonly website: string,
    readonly tournament: string,
    readonly competition: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof tournament !== "string" ||
      typeof competition !== "string"
    ) {
      throw new ValidationError<GamesForAppsRefusedCode>(
        "GamesForApps.NotText",
      );
    }
  }
}
