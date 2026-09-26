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
import { AddSwiss } from "./AddSwiss.js";

/**
 * Adding a Swiss to a tournament: its name, and what each of its matches is the
 * best of. It is answered with the new competition's id.
 */
export class AddSwissHandler extends CommandHandler<AddSwiss, CompetitionId> {
  readonly handles: RequestType<AddSwiss> = AddSwiss;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddSwiss): Promise<CompetitionId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddSwiss",
    );
    const id = CompetitionId.create();
    tournament.addSwiss(
      id,
      CompetitionName.from(command.name),
      BestOf.from(command.bestOf),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    return id;
  }
}
