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
    tournament.updateSwiss(
      CompetitionId.from(command.competition),
      CompetitionName.from(command.name),
      BestOf.from(command.bestOf),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
