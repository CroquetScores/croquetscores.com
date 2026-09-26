import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { RemoveManager } from "./RemoveManager.js";

/**
 * Taking somebody off a tournament's managers, named by their account's id,
 * since they are chosen from those the tournament has rather than typed.
 */
export class RemoveManagerHandler extends CommandHandler<RemoveManager, void> {
  readonly handles: RequestType<RemoveManager> = RemoveManager;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RemoveManager): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RemoveManager",
    );
    tournament.removeManager(
      AccountId.from(command.manager),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
