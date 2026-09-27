import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type ListedManager,
  ManagersOfTournament,
} from "./ManagersOfTournament.js";
import { managedBy, namesOf } from "./tournamentOperations.js";

export class ManagersOfTournamentHandler extends QueryHandler<
  ManagersOfTournament,
  readonly ListedManager[]
> {
  readonly handles: RequestType<ManagersOfTournament> = ManagersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: ManagersOfTournament): Promise<readonly ListedManager[]> {
    const { by, tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "ManagersOfTournament",
    );
    return (await namesOf(this.accounts, tournament.managers)).map(
      ({ id, name }) => ({ id: id.value, name, isReader: id.equals(by) }),
    );
  }
}
