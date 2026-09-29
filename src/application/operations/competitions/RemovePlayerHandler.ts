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
import { RemovePlayer } from "./RemovePlayer.js";

/**
 * Removing a competition's player entered by mistake, once the tournament has
 * said the reader may. Whether they can be is the competition's to say.
 */
export class RemovePlayerHandler extends CommandHandler<RemovePlayer, void> {
  readonly handles: RequestType<RemovePlayer> = RemovePlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: RemovePlayer): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "RemovePlayer",
    );
    competition.removePlayer(
      CompetitionPlayerId.from(command.playerId),
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
  }
}
