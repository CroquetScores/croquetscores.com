import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { UpdateTeam } from "./UpdateTeam.js";

/**
 * Correcting one of a tournament's teams. Its tests are called by its new
 * short name, which is the tournament's to do.
 */
export class UpdateTeamHandler extends CommandHandler<UpdateTeam, void> {
  readonly handles: RequestType<UpdateTeam> = UpdateTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: UpdateTeam): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdateTeam",
    );
    tournament.updateTeam(
      TeamId.from(command.team),
      command.details,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
