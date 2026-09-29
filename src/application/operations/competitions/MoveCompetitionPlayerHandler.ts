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
import { MoveCompetitionPlayer } from "./MoveCompetitionPlayer.js";

/**
 * Moving one of a competition's players up or down a place, once the
 * tournament has said the reader may. Where they go and what order they are
 * given are the competition's to say.
 */
export class MoveCompetitionPlayerHandler extends CommandHandler<
  MoveCompetitionPlayer,
  void
> {
  readonly handles: RequestType<MoveCompetitionPlayer> = MoveCompetitionPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: MoveCompetitionPlayer): Promise<void> {
    const { by, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "MoveCompetitionPlayer",
    );
    const id = CompetitionPlayerId.from(command.playerId);
    // Up or down, and nothing else, once the validator has let it in.
    const direction = command.direction === "up" ? "up" : "down";
    if (id.equals(CompetitionPlayerId.bye())) {
      // A bye with no order said is one the competition does not have.
      competition.moveBye(
        command.byeOrder ?? 0,
        direction,
        told,
        by,
        command.requestedAt,
      );
    } else {
      competition.movePlayer(id, direction, told, by, command.requestedAt);
    }
    await this.competitions.save(competition);
  }
}
