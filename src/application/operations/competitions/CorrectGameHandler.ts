import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { gamePlayerIdFrom } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
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
import { CorrectGame } from "./CorrectGame.js";

/**
 * Correcting a game's scores, by a manager or a scorer, once the tournament
 * has said the reader may, and what the competition needs of it: which of a
 * score's endings are marks is the website's the tournament is run on, and
 * whether drawn games are allowed is the tournament's. Whether it can be is
 * the competition's and the game's to say.
 */
export class CorrectGameHandler extends CommandHandler<CorrectGame, void> {
  readonly handles: RequestType<CorrectGame> = CorrectGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: CorrectGame): Promise<void> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "CorrectGame",
      { scorers: true },
    );
    // Each is there, once the validator has let it in.
    const { winnerScore, loserScore, winner, loser } = command.scores;
    // A competition's player, or in a test a player of one of its teams.
    const player = (id: string | undefined) =>
      id === undefined ? undefined : gamePlayerIdFrom(id);
    competition.correctGame(
      GameId.from(command.gameId),
      Score.read(winnerScore ?? "", tournament.website),
      Score.read(loserScore ?? "", tournament.website),
      told,
      by,
      command.requestedAt,
      { winner: player(winner), loser: player(loser) },
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
      competition,
    );
  }
}
