import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Administrator } from "../../../domain/aggregates/accounts/Administrator.js";
import { WorldRankingOfficer } from "../../../domain/aggregates/accounts/WorldRankingOfficer.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
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

// The sports whose tournaments a world ranking officer looks after: those with
// world rankings (Sport.feature).
const rankedSports = Sport.all
  .filter(({ hasWorldRankings }) => hasWorldRankings)
  .map(({ code }) => code);

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
      : reader instanceof WorldRankingOfficer
        ? this.byAccount.tournamentsOfRankingOfficer(
            reader,
            website,
            query.year,
            rankedSports,
          )
        : this.byAccount.tournamentsOf(reader, website, query.year);
  }
}
