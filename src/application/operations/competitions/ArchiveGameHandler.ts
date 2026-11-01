import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { keepLosersKnockoutsInStep } from "./losersKnockouts.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { ArchiveGame } from "./ArchiveGame.js";

/**
 * Archiving a score entered by mistake, by a manager or a scorer, once the
 * tournament has said the reader may. Whether it can be is the competition's
 * to say.
 */
export class ArchiveGameHandler extends CommandHandler<ArchiveGame, void> {
  readonly handles: RequestType<ArchiveGame> = ArchiveGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: ArchiveGame): Promise<void> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "ArchiveGame",
      { scorers: true },
    );
    competition.archiveGame(
      GameId.from(command.gameId),
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
    // What it did may have changed who lost a match, and so who the knockouts
    // that take the losers of its rounds have.
    await keepLosersKnockoutsInStep(
      this.competitions,
      tournament,
      CompetitionId.from(command.competition),
      by,
      command.requestedAt,
    );
  }
}
