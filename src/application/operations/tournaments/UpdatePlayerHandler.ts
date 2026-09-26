import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { UpdatePlayer } from "./UpdatePlayer.js";

/**
 * Correcting one of a tournament's players: everything they are, said again.
 */
export class UpdatePlayerHandler extends CommandHandler<UpdatePlayer, void> {
  readonly handles: RequestType<UpdatePlayer> = UpdatePlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: UpdatePlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdatePlayer",
    );
    tournament.updatePlayer(
      TournamentPlayerId.from(command.playerId),
      command.player,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
