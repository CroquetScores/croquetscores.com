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
  readonly part: "manager" | "scorer";
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
}

/**
 * The tournaments the account the reader is signed in to manages or scores on
 * the website being read, starting in `year`.
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
