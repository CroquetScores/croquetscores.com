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
import { RestoreTeamPlayer } from "./RestoreTeamPlayer.js";

/** Restoring an archived player in one of a tournament's teams. */
export class RestoreTeamPlayerHandler extends CommandHandler<
  RestoreTeamPlayer,
  void
> {
  readonly handles: RequestType<RestoreTeamPlayer> = RestoreTeamPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RestoreTeamPlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RestoreTeamPlayer",
    );
    tournament.restoreTeamPlayer(
      TeamId.from(command.team),
      TeamPlayerId.from(command.playerId),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
