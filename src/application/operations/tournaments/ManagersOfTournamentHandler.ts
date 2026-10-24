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
  type ListedManager,
  type ManagersListed,
  ManagersOfTournament,
} from "./ManagersOfTournament.js";
import { askedBy, namesOf, tournamentFor } from "./tournamentOperations.js";

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
    const by = await askedBy(this.accounts, query.account);
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "ManagersOfTournament",
    );
    const mayChange = tournament.mayManage(by);
    const mayWrite = tournament.mayWriteToManagers(by);
    if (!mayChange && !mayWrite) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager of the tournament can ask for this.",
      );
    }
    const managers: ListedManager[] = [];
    for (const { id, name } of await namesOf(
      this.accounts,
      tournament.managers,
    )) {
      const account = await this.accounts.load(id);
      managers.push({
        id: id.value,
        name,
        isReader: id.equals(by),
        // Only to those who write to them: no other reader is shown another's.
        ...(mayWrite && account !== undefined
          ? { emailAddress: account.emailAddress.toString() }
          : {}),
      });
    }
    return { managers, mayChange };
  }
}
