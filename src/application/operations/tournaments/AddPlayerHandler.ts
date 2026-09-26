import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddPlayer } from "./AddPlayer.js";

/**
 * Adding a player to a tournament. It is answered with the new player's id.
 */
export class AddPlayerHandler extends CommandHandler<
  AddPlayer,
  TournamentPlayerId
> {
  readonly handles: RequestType<AddPlayer> = AddPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddPlayer): Promise<TournamentPlayerId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddPlayer",
    );
    const id = TournamentPlayerId.create();
    tournament.addPlayer(id, command.player, by, command.requestedAt);
    await this.tournaments.save(tournament);
    return id;
  }
}
