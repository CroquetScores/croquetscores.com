import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { KnockoutDraw } from "../../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddKnockout } from "./AddKnockout.js";

/**
 * Adding a knockout to a tournament: its name, and the shape of its draw. It is
 * answered with the new competition's id.
 */
export class AddKnockoutHandler extends CommandHandler<
  AddKnockout,
  CompetitionId
> {
  readonly handles: RequestType<AddKnockout> = AddKnockout;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddKnockout): Promise<CompetitionId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddKnockout",
    );
    const id = CompetitionId.create();
    tournament.addKnockout(
      id,
      CompetitionName.from(command.name),
      KnockoutDraw.from(command.places, command.rounds),
      by,
      command.requestedAt,
      command.rules,
    );
    await this.tournaments.save(tournament);
    return id;
  }
}
