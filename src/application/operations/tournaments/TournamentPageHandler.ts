import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type TournamentAddresses,
  readerAs,
  tournamentAtAddress,
  unlessArchived,
} from "./tournamentOperations.js";
import { type TournamentAsPaged, TournamentPage } from "./TournamentPage.js";

export class TournamentPageHandler extends QueryHandler<
  TournamentPage,
  TournamentAsPaged
> {
  readonly handles: RequestType<TournamentPage> = TournamentPage;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: TournamentPage): Promise<TournamentAsPaged> {
    const tournament = await tournamentAtAddress(
      this.tournaments,
      this.addresses,
      query.address,
    );
    const reader = await readerAs(this.accounts, query.account);
    const mayChangeWorldRankingNames =
      tournament.mayChangeWorldRankingNames(reader);
    const part = tournament.mayManage(reader)
      ? "manager"
      : tournament.scores(reader)
        ? "scorer"
        : mayChangeWorldRankingNames
          ? "rankingOfficer"
          : undefined;
    if (part === undefined) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager or a scorer of the tournament has a page of it.",
      );
    }
    unlessArchived(tournament);
    return {
      id: tournament.id.value,
      address: tournament.address.toString(),
      name: tournament.name.toString(),
      part,
      playedByTeams: tournament.format.isTeamFormat,
      worldRankingSport: tournament.sport.hasWorldRankings
        ? tournament.sport.code
        : undefined,
      mayChangeWorldRankingNames,
      sport: tournament.sport.code,
      countsTowardsWorldRankings: tournament.worldRankings,
    };
  }
}
