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
import { MoveGame } from "./MoveGame.js";

/**
 * Moving a test's score up or down a place, by a manager or a scorer, once the
 * tournament has said the reader may. Whether it can be is the competition's
 * to say.
 */
export class MoveGameHandler extends CommandHandler<MoveGame, void> {
  readonly handles: RequestType<MoveGame> = MoveGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: MoveGame): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "MoveGame",
      { scorers: true },
    );
    // The validator has asked that it is one or the other.
    const direction = command.direction === "down" ? "down" : "up";
    competition.moveGame(
      GameId.from(command.gameId),
      direction,
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
  }
}
