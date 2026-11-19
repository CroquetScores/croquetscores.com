import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionHead } from "./competitionForApps.js";

/** Every reason asking for a competition's standings can be refused where it is asked. */
export type StandingsForAppsRefusedCode = "StandingsForApps.NotText";

/** One player's line of the standings of a block or a Swiss. */
export interface StandingForApps {
  /** What the tournament keeps them by, which never changes. */
  readonly playerId: string;
  readonly name: string;
  readonly withdrawn: boolean;
  /** Matches decided in a block, and games played in a Swiss. */
  readonly played: number;
  /** Matches won in a block, and games won in a Swiss. */
  readonly won: number;
  /** Matches lost, in a block only. */
  readonly lost: number | undefined;
  /** Games won, in a block only, where `won` counts matches. */
  readonly gamesWon: number | undefined;
  /** Games won less games lost, in a block only. */
  readonly netGames: number | undefined;
  /** Hoops scored less hoops scored against, or the same of the percentage in Advantage Golf Croquet. */
  readonly netHoops: number;
  /** Their place, the first being 1, or nothing where they have withdrawn. */
  readonly position: number | undefined;
  /** Whether others share that place with them, as the site marks it "=2". */
  readonly shared: boolean;
}

/** The standings of a competition, as its page shows them. */
export interface StandingsToTell {
  readonly competition: CompetitionHead;
  /** In the order of the places, those who have withdrawn last. */
  readonly standings: readonly StandingForApps[];
}

/**
 * The standings of the competition `competition` of the tournament
 * `tournament`, both by id, of the website being read, as its page shows them:
 * for a block or a Swiss. A knockout or a test has none, and is refused as
 * `StandingsForApps.NoStandings`. For anybody, so it names nobody.
 */
export class StandingsForApps extends Query<StandingsToTell> {
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
      throw new ValidationError<StandingsForAppsRefusedCode>(
        "StandingsForApps.NotText",
      );
    }
  }
}
