import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchiveTeam } from "./ArchiveTeam.js";

/**
 * Archiving one of a tournament's teams. Whether it plays in a test in use is
 * the tournament's own to know, since its tests are its competitions.
 */
export class ArchiveTeamHandler extends CommandHandler<ArchiveTeam, void> {
  readonly handles: RequestType<ArchiveTeam> = ArchiveTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ArchiveTeam): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ArchiveTeam",
    );
    tournament.archiveTeam(TeamId.from(command.team), by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
