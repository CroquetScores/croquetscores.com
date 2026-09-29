import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Games } from "../../services/Games.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import {
  type Competitions,
  toldOf,
} from "../competitions/competitionOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchivePlayer } from "./ArchivePlayer.js";

/**
 * Archiving one of a tournament's players. Whether they have played any games
 * is asked of the application's games. An archived player is in no
 * competition, so they are removed from every one they are in, archived
 * competitions among them. It is one command, so the archiving and every
 * removal are kept in the one transaction, or none of them is.
 */
export class ArchivePlayerHandler extends CommandHandler<ArchivePlayer, void> {
  readonly handles: RequestType<ArchivePlayer> = ArchivePlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(command: ArchivePlayer): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ArchivePlayer",
    );
    const player = TournamentPlayerId.from(command.playerId);
    tournament.archivePlayer(
      player,
      await this.games.hasPlayed(tournament.id, player),
      by,
      command.requestedAt,
    );
    // Only once the tournament has archived them, so that a player it refuses
    // is left in every competition.
    const removedFrom = [];
    for (const { reference } of tournament.competitions) {
      const competition = await this.competitions.load(reference.id);
      if (competition === undefined) continue;
      competition.removeArchivedPlayer(
        player,
        toldOf(tournament, reference.id),
        by,
        command.requestedAt,
      );
      removedFrom.push(competition);
    }
    await this.tournaments.save(tournament);
    for (const competition of removedFrom) {
      await this.competitions.save(competition);
    }
  }
}
