import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { RestorePlayer } from "./RestorePlayer.js";

/**
 * Restoring one of a tournament's archived players.
 */
export class RestorePlayerHandler extends CommandHandler<RestorePlayer, void> {
  readonly handles: RequestType<RestorePlayer> = RestorePlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RestorePlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RestorePlayer",
    );
    tournament.restorePlayer(
      TournamentPlayerId.from(command.playerId),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
