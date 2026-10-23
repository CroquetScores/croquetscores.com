import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Website } from "../../../domain/common/Website.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for an account's tournaments can be refused where it is asked. */
export type TournamentsOfAccountRefusedCode =
  "TournamentsOfAccount.NotText" | "TournamentsOfAccount.YearNotWhole";

/** A tournament an account has a part in, as the admin lists it. */
export interface TournamentOfAccount {
  readonly id: string;
  readonly name: string;
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  /** Where it is found, as "2026/ac/spring-open". */
  readonly address: string;
  readonly archived: boolean;
  /**
   * The code of the country it is played in. Nothing for a tournament the read
   * model has not been rebuilt for since countries were kept in it.
   */
  readonly country: string | undefined;
  /** The code of the region of that country it is played in, where it is in one. */
  readonly region: string | undefined;
  /**
   * The account's part in it: a manager's or a scorer's, or, for a world
   * ranking officer with no part in it, one whose players' world ranking
   * names it looks after.
   */
  readonly part: "manager" | "scorer" | "rankingOfficer";
}

/**
 * The tournaments an account manages or scores, and the years it has them in,
 * as a read model keeps them. The application names what it asks; the
 * infrastructure keeps the answer.
 */
export interface TournamentsByAccount {
  /**
   * Those on `website` starting in `year`: the newest first, those starting
   * on the same day by name, and archived ones after all the rest.
   */
  tournamentsOf(
    account: AccountId,
    website: Website,
    year: number,
  ): Promise<readonly TournamentOfAccount[]>;

  /** The years it has one starting in on `website`, the newest first, each once. */
  yearsOf(account: AccountId, website: Website): Promise<readonly number[]>;

  /**
   * Every tournament on `website` starting in `year`, each once and each as
   * one managed, in the order tournamentsOf keeps: for an administrator, who
   * may do to every tournament what its managers may.
   */
  everyTournament(
    website: Website,
    year: number,
  ): Promise<readonly TournamentOfAccount[]>;

  /** The years any tournament on `website` starts in, the newest first, each once. */
  everyYear(website: Website): Promise<readonly number[]>;

  /**
   * For a world ranking officer: those on `website` starting in `year` that
   * `account` manages or scores, as tournamentsOf answers them, and every one
   * of a sport whose code is among `sports` besides, as one whose rankings it
   * looks after, in the order tournamentsOf keeps.
   */
  tournamentsOfRankingOfficer(
    account: AccountId,
    website: Website,
    year: number,
    sports: readonly string[],
  ): Promise<readonly TournamentOfAccount[]>;

  /** The years of the tournaments tournamentsOfRankingOfficer answers, the newest first, each once. */
  yearsOfRankingOfficer(
    account: AccountId,
    website: Website,
    sports: readonly string[],
  ): Promise<readonly number[]>;
}

/**
 * The tournaments the account the reader is signed in to manages or scores on
 * the website being read, starting in `year`: every one there, as one it
 * manages, where the account administers the site, and every one of a sport
 * of a sport it looks after the rankings of besides its own where it is a world
 * ranking officer.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nobody can list another account's tournaments.
 */
export class TournamentsOfAccount extends Query<
  readonly TournamentOfAccount[]
> {
  constructor(
    readonly account: string,
    readonly website: string,
    readonly year: number,
  ) {
    super();
    if (typeof account !== "string" || typeof website !== "string") {
      throw new ValidationError<TournamentsOfAccountRefusedCode>(
        "TournamentsOfAccount.NotText",
      );
    }
    if (!Number.isSafeInteger(year)) {
      throw new ValidationError<TournamentsOfAccountRefusedCode>(
        "TournamentsOfAccount.YearNotWhole",
      );
    }
  }
}
