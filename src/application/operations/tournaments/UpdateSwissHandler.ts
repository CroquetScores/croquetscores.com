import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { Games } from "../../services/Games.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { UpdateSwiss } from "./UpdateSwiss.js";

/**
 * Correcting one of a tournament's Swisses: its name, and what each of its
 * matches is the best of, said again.
 */
export class UpdateSwissHandler extends CommandHandler<UpdateSwiss, void> {
  readonly handles: RequestType<UpdateSwiss> = UpdateSwiss;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(command: UpdateSwiss): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdateSwiss",
    );
    const competition = CompetitionId.from(command.competition);
    // Whether it has any game kept only matters to a change of whether it is
    // Advantage, which only a request that says its rules can make, so a
    // request that says none is not made to read every game it has
    // (advantage.feature).
    const hasGames =
      command.rules !== undefined &&
      (await this.games.hasAnyIn(tournament.id, competition));
    tournament.updateSwiss(
      competition,
      CompetitionName.from(command.name),
      BestOf.from(command.bestOf),
      hasGames,
      by,
      command.requestedAt,
      command.rules,
    );
    await this.tournaments.save(tournament);
  }
}
