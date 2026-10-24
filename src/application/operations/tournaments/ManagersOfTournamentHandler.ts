import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type ListedManager,
  type ManagersListed,
  ManagersOfTournament,
} from "./ManagersOfTournament.js";
import { managedOrWrittenToBy, namesOf } from "./tournamentOperations.js";

export class ManagersOfTournamentHandler extends QueryHandler<
  ManagersOfTournament,
  ManagersListed
> {
  readonly handles: RequestType<ManagersOfTournament> = ManagersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: ManagersOfTournament): Promise<ManagersListed> {
    const { by, tournament, mayChange, mayWrite } = await managedOrWrittenToBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "ManagersOfTournament",
    );
    const managers = (await namesOf(this.accounts, tournament.managers)).map(
      ({ id, name, account }): ListedManager => ({
        id: id.value,
        name,
        isReader: id.equals(by),
        // Only those who write to the managers are told another's address.
        ...(mayWrite ? { emailAddress: account.emailAddress.toString() } : {}),
      }),
    );
    return { managers, mayChange };
  }
}
