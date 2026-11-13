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
import type { EmailQueue } from "../../services/EmailQueue.js";
import { tellOfNotableTournament } from "./notableTournament.js";
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
    private readonly queue: EmailQueue,
    /** Who is told of a national or an international tournament. */
    private readonly administratorEmailAddress: string,
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
    // An update that changed nothing recorded nothing, and has nothing to tell.
    const changed = tournament.recorded.length > 0;
    await this.tournaments.save(tournament);
    if (!changed) return;
    await tellOfNotableTournament(
      this.queue,
      this.administratorEmailAddress,
      {
        name: tournament.name.toString(),
        address: tournament.address.toString(),
        website: tournament.website,
      },
      details,
      "edited",
      command.requestedAt,
    );
  }
}
