import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { type Competitions } from "../competitions/competitionOperations.js";
import { keepLosersKnockoutsInStep } from "../competitions/losersKnockouts.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddLosersKnockout } from "./AddLosersKnockout.js";

/**
 * Adding a knockout that takes the losers of a round of another. Matches of
 * that round may be decided already, so their losers are put in as soon as it
 * is added, rather than waiting for the next game.
 */
export class AddLosersKnockoutHandler extends CommandHandler<
  AddLosersKnockout,
  CompetitionId
> {
  readonly handles: RequestType<AddLosersKnockout> = AddLosersKnockout;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: AddLosersKnockout): Promise<CompetitionId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddLosersKnockout",
    );
    const id = CompetitionId.create();
    const from = CompetitionId.from(command.from);
    tournament.addLosersKnockout(
      id,
      CompetitionName.from(command.name),
      from,
      command.round,
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    await keepLosersKnockoutsInStep(
      this.competitions,
      tournament,
      from,
      by,
      command.requestedAt,
    );
    return id;
  }
}
