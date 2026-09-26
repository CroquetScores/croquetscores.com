import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import { Website } from "../../../domain/common/Website.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { askedBy, detailsFrom, takenFor } from "./tournamentOperations.js";
import {
  CreateTournament,
  type CreatedTournament,
} from "./CreateTournament.js";

/**
 * Creating a tournament: the account the reader is signed in to, who creates
 * it, the website the request came to, and what the tournament is to be. It is
 * answered with the new tournament's id and the address it is found at, so that
 * the reader can be taken to it.
 */
export class CreateTournamentHandler extends CommandHandler<
  CreateTournament,
  CreatedTournament
> {
  readonly handles: RequestType<CreateTournament> = CreateTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(command: CreateTournament): Promise<CreatedTournament> {
    const by = await askedBy(this.accounts, command.account);
    const id = TournamentId.create();
    const details = detailsFrom(command.tournament);
    const tournament = Tournament.create(
      id,
      Website.from(command.website),
      details,
      await takenFor(this.addresses, details, id),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    return { id, address: tournament.address };
  }
}
