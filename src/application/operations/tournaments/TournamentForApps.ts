import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a tournament for an app can be refused where it is asked. */
export type TournamentForAppsRefusedCode = "TournamentForApps.NotText";

/** One of a tournament's competitions, as an app is told of it. */
export interface CompetitionForApps {
  readonly id: string;
  readonly name: string;
  /** Block, Swiss, knockout, or test: the site's word for a match between two teams. */
  readonly kind: "block" | "swiss" | "knockout" | "test";
  /** Where its page is on the public site, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
  /** When anything was last kept of it. */
  readonly changedAt: ReadOnlyDate;
}

/** One of a tournament's players, as an app is told of them. */
export interface PlayerForApps {
  readonly id: string;
  readonly name: string;
  /** What the world rankings know them by, which is their name where none was given. */
  readonly worldRankingName: string;
  readonly handicap: string | undefined;
  /** What they represent, or nothing where they represent nothing. */
  readonly representing: string | undefined;
}

/** A team of a tournament played by teams, and its players. */
export interface TeamForApps {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly players: readonly {
    readonly id: string;
    readonly name: string;
    readonly worldRankingName: string;
  }[];
}

/** A tournament as an app is told of it. */
export interface TournamentForAppsRead {
  readonly id: string;
  readonly name: string;
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  readonly country: string;
  readonly region: string | undefined;
  readonly sport: string;
  /** Where it is found on the site, as "2026/ac/spring-open". */
  readonly address: string;
  readonly national: boolean;
  readonly international: boolean;
  /** When anything was last kept of it or of any of its competitions. */
  readonly changedAt: ReadOnlyDate;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionForApps[];
  /** Its players in use, by name; none where it is played by teams. */
  readonly players: readonly PlayerForApps[];
  /** Its teams in use, in the tournament's order; none where it is not played by teams. */
  readonly teams: readonly TeamForApps[];
}

/**
 * The tournament `tournament`, by its id, of the website being read, for an
 * app. For anybody, so it names nobody. Refused as `NoSuchTournament` where
 * there is none, where it is another website's, where it is archived, and
 * where what was sent is no id at all, since an app that mistyped an address
 * has no use for a finer answer.
 */
export class TournamentForApps extends Query<TournamentForAppsRead> {
  constructor(
    readonly website: string,
    readonly tournament: string,
  ) {
    super();
    if (typeof website !== "string" || typeof tournament !== "string") {
      throw new ValidationError<TournamentForAppsRefusedCode>(
        "TournamentForApps.NotText",
      );
    }
  }
}
