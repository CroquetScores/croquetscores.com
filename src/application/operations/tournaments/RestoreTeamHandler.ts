import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { RestoreTeam } from "./RestoreTeam.js";

/** Restoring one of a tournament's archived teams. */
export class RestoreTeamHandler extends CommandHandler<RestoreTeam, void> {
  readonly handles: RequestType<RestoreTeam> = RestoreTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RestoreTeam): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RestoreTeam",
    );
    tournament.restoreTeam(TeamId.from(command.team), by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
