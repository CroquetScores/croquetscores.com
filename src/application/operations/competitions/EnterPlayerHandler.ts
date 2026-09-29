import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentPlayerErrorCode } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionManagedBy,
} from "./competitionOperations.js";
import { EnterPlayer } from "./EnterPlayer.js";

/**
 * Entering a tournament's player in one of its competitions. The tournament is
 * asked first, since it knows who may and which of its players there are, and
 * it says the player's order, which the competition starts them in.
 */
export class EnterPlayerHandler extends CommandHandler<EnterPlayer, string> {
  readonly handles: RequestType<EnterPlayer> = EnterPlayer;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: EnterPlayer): Promise<string> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "EnterPlayer",
    );
    const id = TournamentPlayerId.from(command.playerId);
    const player = tournament.players.find((each) => each.id.equals(id));
    if (player === undefined) {
      throw new TournamentRefused(
        "Tournament.NoSuchPlayer",
        "The tournament has no such player.",
      );
    }
    // Set aside, and in no competition, until they are restored.
    if (player.archived) {
      throw new ValidationError<TournamentPlayerErrorCode>(
        "TournamentPlayer.Archived",
      );
    }
    const entered = competition.enterPlayer(
      id,
      player.order,
      told,
      by,
      command.requestedAt,
    );
    await this.competitions.save(competition);
    return entered.value;
  }
}
