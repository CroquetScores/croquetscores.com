import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Administrator } from "../../../domain/aggregates/accounts/Administrator.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { readerAs } from "./tournamentOperations.js";
import {
  type TournamentOfAccount,
  type TournamentsByAccount,
  TournamentsOfAccount,
} from "./TournamentsOfAccount.js";

export class TournamentsOfAccountHandler extends QueryHandler<
  TournamentsOfAccount,
  readonly TournamentOfAccount[]
> {
  readonly handles: RequestType<TournamentsOfAccount> = TournamentsOfAccount;

  constructor(
    private readonly byAccount: TournamentsByAccount,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(
    query: TournamentsOfAccount,
  ): Promise<readonly TournamentOfAccount[]> {
    const reader = await readerAs(this.accounts, query.account);
    const website = Website.from(query.website);
    return reader instanceof Administrator
      ? this.byAccount.everyTournament(website, query.year)
      : this.byAccount.tournamentsOf(reader, website, query.year);
  }
}
