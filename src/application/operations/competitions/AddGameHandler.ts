import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { gamePlayerIdFrom } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddGame } from "./AddGame.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { keepLosersKnockoutsInStep } from "./losersKnockouts.js";

/**
 * Adding a game's score to a competition, by a manager or a scorer. The
 * tournament says what kind of competition it is, whether drawn games are
 * allowed, and which website's marks a score is read with.
 */
export class AddGameHandler extends CommandHandler<AddGame, string> {
  readonly handles: RequestType<AddGame> = AddGame;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: AddGame): Promise<string> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "AddGame",
      { scorers: true },
    );
    // Each is there, once the validator has let it in.
    const { winner, winnerScore, loser, loserScore } = command.game;
    const id = GameId.create();
    competition.addGame(
      id,
      {
        winner: gamePlayerIdFrom(winner ?? ""),
        winnerScore: Score.read(winnerScore ?? "", tournament.website),
        loser: gamePlayerIdFrom(loser ?? ""),
        loserScore: Score.read(loserScore ?? "", tournament.website),
      },
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
    return id.value;
  }
}
