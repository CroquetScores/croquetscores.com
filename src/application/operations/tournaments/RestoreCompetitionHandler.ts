import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { RestoreCompetition } from "./RestoreCompetition.js";

/**
 * Restoring one of a tournament's archived competitions, of whatever kind.
 */
export class RestoreCompetitionHandler extends CommandHandler<
  RestoreCompetition,
  void
> {
  readonly handles: RequestType<RestoreCompetition> = RestoreCompetition;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RestoreCompetition): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RestoreCompetition",
    );
    tournament.restoreCompetition(
      CompetitionId.from(command.competition),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
