import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { Games } from "../../services/Games.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchiveTeamPlayer } from "./ArchiveTeamPlayer.js";

/**
 * Archiving a player in one of a tournament's teams. Whether they have played
 * any games in its tests is asked of the application's games. A player in a
 * team is in no competition, so there is nothing to remove them from.
 */
export class ArchiveTeamPlayerHandler extends CommandHandler<
  ArchiveTeamPlayer,
  void
> {
  readonly handles: RequestType<ArchiveTeamPlayer> = ArchiveTeamPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(command: ArchiveTeamPlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ArchiveTeamPlayer",
    );
    const player = TeamPlayerId.from(command.playerId);
    tournament.archiveTeamPlayer(
      TeamId.from(command.team),
      player,
      await this.games.teamPlayerHasPlayed(tournament.id, player),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
