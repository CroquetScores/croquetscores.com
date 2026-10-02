import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddTeam } from "./AddTeam.js";

/**
 * Adding a team to a tournament played by teams. It is answered with the new
 * team's id.
 */
export class AddTeamHandler extends CommandHandler<AddTeam, TeamId> {
  readonly handles: RequestType<AddTeam> = AddTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddTeam): Promise<TeamId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddTeam",
    );
    const id = TeamId.create();
    tournament.addTeam(id, command.team, by, command.requestedAt);
    await this.tournaments.save(tournament);
    return id;
  }
}
