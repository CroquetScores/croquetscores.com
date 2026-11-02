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
import { type CompetitionAsPaged, CompetitionPage } from "./CompetitionPage.js";
import {
  type TournamentAddresses,
  readerAs,
  tournamentAtAddress,
  unlessArchived,
} from "./tournamentOperations.js";

export class CompetitionPageHandler extends QueryHandler<
  CompetitionPage,
  CompetitionAsPaged
> {
  readonly handles: RequestType<CompetitionPage> = CompetitionPage;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: CompetitionPage): Promise<CompetitionAsPaged> {
    const tournament = await tournamentAtAddress(
      this.tournaments,
      this.addresses,
      query.address,
    );
    const reader = await readerAs(this.accounts, query.account);
    const part = tournament.mayManage(reader)
      ? "manager"
      : tournament.scores(reader)
        ? "scorer"
        : undefined;
    if (part === undefined) {
      throw new TournamentRefused(
        "Tournament.NotAManagerOrScorer",
        "Only a manager or a scorer of the tournament sees its competitions.",
      );
    }
    unlessArchived(tournament);
    const found = tournament.competitions.find(
      ({ reference }) => reference.slug.toString() === query.slug,
    );
    if (found === undefined) {
      throw new TournamentRefused(
        "Tournament.NoSuchCompetition",
        "The tournament has no competition at that address.",
      );
    }
    if (found.reference.archived) {
      throw new TournamentRefused(
        "Tournament.CompetitionArchived",
        "An archived competition can only be restored.",
      );
    }
    return {
      id: found.reference.id.value,
      tournament: tournament.id.value,
      name: found.reference.name.toString(),
      kind: found.shape.kind,
      canSetPlayers:
        found.shape.kind !== "knockout" || found.shape.losersOf === undefined,
      tournamentAddress: tournament.address.toString(),
      slug: found.reference.slug.toString(),
      part,
      worldRankingSport: tournament.sport.hasWorldRankings
        ? tournament.sport.code
        : undefined,
      usualMaximumHoops: tournament.sport.usualMaximumHoops,
    };
  }
}
