import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
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

  constructor(private readonly byAccount: TournamentsByAccount) {
    super();
  }

  handle(query: TournamentsOfAccount): Promise<readonly TournamentOfAccount[]> {
    return this.byAccount.tournamentsOf(
      AccountId.from(query.account),
      Website.from(query.website),
      query.year,
    );
  }
}
