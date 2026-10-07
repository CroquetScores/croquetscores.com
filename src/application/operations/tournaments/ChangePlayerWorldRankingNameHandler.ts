import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { ChangePlayerWorldRankingName } from "./ChangePlayerWorldRankingName.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Changing one of a tournament's players' world ranking name alone, as the
 * tournament allows it (changeWorldRankingName.feature).
 */
export class ChangePlayerWorldRankingNameHandler extends CommandHandler<
  ChangePlayerWorldRankingName,
  void
> {
  readonly handles: RequestType<ChangePlayerWorldRankingName> =
    ChangePlayerWorldRankingName;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ChangePlayerWorldRankingName): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ChangePlayerWorldRankingName",
    );
    tournament.changeWorldRankingName(
      TournamentPlayerId.from(command.playerId),
      command.worldRankingName,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
