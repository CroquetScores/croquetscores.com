import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionPlayerId } from "../../../domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangeCarryForward } from "./ChangeCarryForward.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";

/**
 * Changing what a competition's player carries forward, once the tournament
 * has said the reader may. Whether the competition has standings for it is
 * the competition's to say, as the tournament tells it what kind it is.
 */
export class ChangeCarryForwardHandler extends CommandHandler<
  ChangeCarryForward,
  void
> {
  readonly handles: RequestType<ChangeCarryForward> = ChangeCarryForward;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: ChangeCarryForward): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "ChangeCarryForward",
    );
    competition.changeCarryForward(
      CompetitionPlayerId.from(command.playerId),
      command.counts,
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
  }
}
