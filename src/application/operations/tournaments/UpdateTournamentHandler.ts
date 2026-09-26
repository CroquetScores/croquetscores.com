import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import {
  askedBy,
  detailsFrom,
  takenFor,
  tournamentFor,
} from "./tournamentOperations.js";
import { UpdateTournament } from "./UpdateTournament.js";

/**
 * Changing what a tournament is: the account the reader is signed in to, the
 * tournament, and everything it is to be, said again.
 */
export class UpdateTournamentHandler extends CommandHandler<
  UpdateTournament,
  void
> {
  readonly handles: RequestType<UpdateTournament> = UpdateTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(command: UpdateTournament): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdateTournament",
    );
    const details = detailsFrom(command.details);
    tournament.update(
      details,
      await takenFor(this.addresses, details, tournament.id),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
