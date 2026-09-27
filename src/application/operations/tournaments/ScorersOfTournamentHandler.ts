import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type ListedScorer,
  ScorersOfTournament,
} from "./ScorersOfTournament.js";
import { managedBy, namesOf } from "./tournamentOperations.js";

export class ScorersOfTournamentHandler extends QueryHandler<
  ScorersOfTournament,
  readonly ListedScorer[]
> {
  readonly handles: RequestType<ScorersOfTournament> = ScorersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: ScorersOfTournament): Promise<readonly ListedScorer[]> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "ScorersOfTournament",
    );
    return (await namesOf(this.accounts, tournament.scorers)).map(
      ({ id, name }) => ({ id: id.value, name }),
    );
  }
}
