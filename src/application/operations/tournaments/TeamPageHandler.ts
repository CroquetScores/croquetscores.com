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
import { type TeamAsPaged, TeamPage } from "./TeamPage.js";
import {
  type TournamentAddresses,
  readerAs,
  tournamentAtAddress,
  unlessArchived,
} from "./tournamentOperations.js";

export class TeamPageHandler extends QueryHandler<TeamPage, TeamAsPaged> {
  readonly handles: RequestType<TeamPage> = TeamPage;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: TeamPage): Promise<TeamAsPaged> {
    const tournament = await tournamentAtAddress(
      this.tournaments,
      this.addresses,
      query.address,
    );
    const reader = await readerAs(this.accounts, query.account);
    if (!tournament.mayChangeWorldRankingNames(reader)) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager of the tournament sees its teams.",
      );
    }
    unlessArchived(tournament);
    const team = tournament.teams.find(
      ({ slug }) => slug.toString() === query.slug,
    );
    if (team === undefined) {
      throw new TournamentRefused(
        "Tournament.NoSuchTeam",
        "The tournament has no team at that address.",
      );
    }
    if (team.archived) {
      throw new TournamentRefused(
        "Tournament.TeamArchived",
        "An archived team can only be restored.",
      );
    }
    return {
      id: team.id.value,
      tournament: tournament.id.value,
      name: team.name.toString(),
      shortName: team.shortName.toString(),
      flag: team.flag === undefined ? undefined : String(team.flag),
      tournamentAddress: tournament.address.toString(),
      slug: team.slug.toString(),
      worldRankingSport: tournament.sport.hasWorldRankings
        ? tournament.sport.code
        : undefined,
      manages: tournament.mayManage(reader),
    };
  }
}
