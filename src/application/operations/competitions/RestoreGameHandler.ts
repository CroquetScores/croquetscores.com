import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { carryLosersOn } from "./losersKnockouts.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { RestoreGame } from "./RestoreGame.js";

/**
 * Restoring an archived score, by a manager or a scorer, once the tournament
 * has said the reader may. Whether it can be is the competition's to say.
 */
export class RestoreGameHandler extends CommandHandler<RestoreGame, void> {
  readonly handles: RequestType<RestoreGame> = RestoreGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: RestoreGame): Promise<void> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "RestoreGame",
      { scorers: true },
    );
    competition.restoreGame(
      GameId.from(command.gameId),
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
    // A knockout's game that sets a match's loser aside or changes it changes
    // who the knockouts that take its losers have.
    await carryLosersOn(
      this.competitions,
      tournament,
      competition,
      CompetitionId.from(command.competition),
      by,
      command.requestedAt,
    );
  }
}
