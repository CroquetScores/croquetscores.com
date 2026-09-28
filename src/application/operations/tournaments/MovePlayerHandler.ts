import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { MovePlayer } from "./MovePlayer.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Moving one of a tournament's players up or down a place. Where they go and
 * what order they are given are the tournament's to say. The competitions
 * they are in keep them where they are, since each one's order is its own.
 */
export class MovePlayerHandler extends CommandHandler<MovePlayer, void> {
  readonly handles: RequestType<MovePlayer> = MovePlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: MovePlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "MovePlayer",
    );
    tournament.movePlayer(
      TournamentPlayerId.from(command.playerId),
      // Up or down, and nothing else, once the validator has let it in.
      command.direction === "up" ? "up" : "down",
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
