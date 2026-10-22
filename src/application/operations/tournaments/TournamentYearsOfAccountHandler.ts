import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Administrator } from "../../../domain/aggregates/accounts/Administrator.js";
import { WorldRankingOfficer } from "../../../domain/aggregates/accounts/WorldRankingOfficer.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { readerAs } from "./tournamentOperations.js";
import type { TournamentsByAccount } from "./TournamentsOfAccount.js";
import { TournamentYearsOfAccount } from "./TournamentYearsOfAccount.js";

export class TournamentYearsOfAccountHandler extends QueryHandler<
  TournamentYearsOfAccount,
  readonly number[]
> {
  readonly handles: RequestType<TournamentYearsOfAccount> =
    TournamentYearsOfAccount;

  constructor(
    private readonly byAccount: TournamentsByAccount,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: TournamentYearsOfAccount): Promise<readonly number[]> {
    const reader = await readerAs(this.accounts, query.account);
    const website = Website.from(query.website);
    return reader instanceof Administrator
      ? this.byAccount.everyYear(website)
      : reader instanceof WorldRankingOfficer
        ? this.byAccount.yearsOfRankingOfficer(reader, website, reader.sports)
        : this.byAccount.yearsOf(reader, website);
  }
}
