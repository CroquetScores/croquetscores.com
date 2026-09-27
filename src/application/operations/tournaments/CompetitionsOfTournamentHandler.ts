import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  CompetitionsOfTournament,
  type ListedCompetition,
} from "./CompetitionsOfTournament.js";
import { managedBy } from "./tournamentOperations.js";

export class CompetitionsOfTournamentHandler extends QueryHandler<
  CompetitionsOfTournament,
  readonly ListedCompetition[]
> {
  readonly handles: RequestType<CompetitionsOfTournament> =
    CompetitionsOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(
    query: CompetitionsOfTournament,
  ): Promise<readonly ListedCompetition[]> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "CompetitionsOfTournament",
    );
    // In the tournament's own order, which it keeps lowest first.
    return tournament.competitions.map(({ reference, shape }) => ({
      id: reference.id.value,
      name: reference.name.toString(),
      kind: shape.kind,
      slug: reference.slug.toString(),
      archived: reference.archived,
    }));
  }
}
