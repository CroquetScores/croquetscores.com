import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { AddTest } from "./AddTest.js";
import { testDetailsFrom } from "./testOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Adding a test to a tournament played by teams. Its name and its slug are the
 * tournament's to give. A competition's stream begins with the first thing
 * done to it, so a test has no games, and no stream, until one is added.
 */
export class AddTestHandler extends CommandHandler<AddTest, CompetitionId> {
  readonly handles: RequestType<AddTest> = AddTest;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddTest): Promise<CompetitionId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddTest",
    );
    const id = CompetitionId.create();
    tournament.addTest(
      id,
      testDetailsFrom(command.test),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    return id;
  }
}
