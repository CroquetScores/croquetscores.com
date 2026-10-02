import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Games } from "../../services/Games.js";
import { testDetailsFrom } from "./testOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { UpdateTest } from "./UpdateTest.js";

/**
 * Correcting one of a tournament's tests. What has been played in it is asked
 * of the application's games, and what that leaves to be changed is the
 * tournament's to say.
 */
export class UpdateTestHandler extends CommandHandler<UpdateTest, void> {
  readonly handles: RequestType<UpdateTest> = UpdateTest;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(command: UpdateTest): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdateTest",
    );
    const id = CompetitionId.from(command.testId);
    tournament.updateTest(
      id,
      testDetailsFrom(command.test),
      await this.games.playedIn(tournament.id, id),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
