import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { WithdrawGame } from "./WithdrawGame.js";

/**
 * Withdrawing a score from what counts, by a manager or a scorer, once the
 * tournament has said the reader may. Whether it can be is the competition's
 * to say.
 */
export class WithdrawGameHandler extends CommandHandler<WithdrawGame, void> {
  readonly handles: RequestType<WithdrawGame> = WithdrawGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: WithdrawGame): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "WithdrawGame",
      { scorers: true },
    );
    competition.withdrawGame(
      GameId.from(command.gameId),
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
  }
}
