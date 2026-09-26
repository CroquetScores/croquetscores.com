import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { RemoveScorer } from "./RemoveScorer.js";

/**
 * Taking somebody off a tournament's scorers, named by their account's id,
 * since they are chosen from those the tournament has rather than typed.
 */
export class RemoveScorerHandler extends CommandHandler<RemoveScorer, void> {
  readonly handles: RequestType<RemoveScorer> = RemoveScorer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RemoveScorer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RemoveScorer",
    );
    tournament.removeScorer(
      AccountId.from(command.scorer),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
