import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddTeamPlayer } from "./AddTeamPlayer.js";

/**
 * Adding a player to one of a tournament's teams. It is answered with the new
 * player's id.
 */
export class AddTeamPlayerHandler extends CommandHandler<
  AddTeamPlayer,
  TeamPlayerId
> {
  readonly handles: RequestType<AddTeamPlayer> = AddTeamPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddTeamPlayer): Promise<TeamPlayerId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddTeamPlayer",
    );
    const id = TeamPlayerId.create();
    tournament.addTeamPlayer(
      TeamId.from(command.team),
      id,
      command.player,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    return id;
  }
}
