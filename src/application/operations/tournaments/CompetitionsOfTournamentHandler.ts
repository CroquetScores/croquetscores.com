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
import { managedOrScoredBy } from "./tournamentOperations.js";

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
    const { tournament, part } = await managedOrScoredBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "CompetitionsOfTournament",
    );
    // In the tournament's own order, which it keeps lowest first. A scorer is
    // answered the competitions in use alone: an archived one is set aside,
    // and has no scores to enter.
    return tournament.competitions
      .filter(({ reference }) => part === "manager" || !reference.archived)
      .map(({ reference, shape }): ListedCompetition => {
        const listed = {
          id: reference.id.value,
          name: reference.name.toString(),
          slug: reference.slug.toString(),
          archived: reference.archived,
        };
        return shape.kind === "knockout"
          ? {
              ...listed,
              kind: shape.kind,
              places: shape.draw.places,
              rounds: shape.draw.rounds.map((round) => round.games),
            }
          : { ...listed, kind: shape.kind, bestOf: shape.bestOf.games };
      });
  }
}
