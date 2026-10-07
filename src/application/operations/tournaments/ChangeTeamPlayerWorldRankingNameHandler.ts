import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { ChangeTeamPlayerWorldRankingName } from "./ChangeTeamPlayerWorldRankingName.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Changing a team player's world ranking name alone, as the tournament allows
 * it (changeTeamPlayerWorldRankingName.feature).
 */
export class ChangeTeamPlayerWorldRankingNameHandler extends CommandHandler<
  ChangeTeamPlayerWorldRankingName,
  void
> {
  readonly handles: RequestType<ChangeTeamPlayerWorldRankingName> =
    ChangeTeamPlayerWorldRankingName;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ChangeTeamPlayerWorldRankingName): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ChangeTeamPlayerWorldRankingName",
    );
    tournament.changeTeamPlayerWorldRankingName(
      TeamId.from(command.team),
      TeamPlayerId.from(command.playerId),
      command.worldRankingName,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
