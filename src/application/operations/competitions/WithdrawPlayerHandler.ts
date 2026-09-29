import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionPlayerId } from "../../../domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { WithdrawPlayer } from "./WithdrawPlayer.js";

/**
 * Withdrawing a competition's player, once the tournament has said the
 * reader may. Where they go is the competition's to say.
 */
export class WithdrawPlayerHandler extends CommandHandler<
  WithdrawPlayer,
  void
> {
  readonly handles: RequestType<WithdrawPlayer> = WithdrawPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: WithdrawPlayer): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "WithdrawPlayer",
    );
    competition.withdrawPlayer(
      CompetitionPlayerId.from(command.playerId),
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
  }
}
