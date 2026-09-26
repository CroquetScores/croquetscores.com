import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentsByAccount } from "./TournamentsOfAccount.js";
import { TournamentYearsOfAccount } from "./TournamentYearsOfAccount.js";

export class TournamentYearsOfAccountHandler extends QueryHandler<
  TournamentYearsOfAccount,
  readonly number[]
> {
  readonly handles: RequestType<TournamentYearsOfAccount> =
    TournamentYearsOfAccount;

  constructor(private readonly byAccount: TournamentsByAccount) {
    super();
  }

  handle(query: TournamentYearsOfAccount): Promise<readonly number[]> {
    return this.byAccount.yearsOf(
      AccountId.from(query.account),
      Website.from(query.website),
    );
  }
}
