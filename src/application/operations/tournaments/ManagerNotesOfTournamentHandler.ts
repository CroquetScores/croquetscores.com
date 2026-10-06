import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type {
  ManagerNoteHeading,
  TournamentManagerNotes,
} from "./managerNoteOperations.js";
import { ManagerNotesOfTournament } from "./ManagerNotesOfTournament.js";
import { managedBy } from "./tournamentOperations.js";

export class ManagerNotesOfTournamentHandler extends QueryHandler<
  ManagerNotesOfTournament,
  readonly ManagerNoteHeading[]
> {
  readonly handles: RequestType<ManagerNotesOfTournament> =
    ManagerNotesOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly notes: TournamentManagerNotes,
  ) {
    super();
  }

  async handle(
    query: ManagerNotesOfTournament,
  ): Promise<readonly ManagerNoteHeading[]> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "ManagerNotesOfTournament",
    );
    return this.notes.of(tournament.id);
  }
}
