import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentPlayerErrorCode } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { pairName } from "../../../domain/aggregates/tournaments/value-objects/pairName.js";
import { pairRepresenting } from "../../../domain/aggregates/tournaments/value-objects/pairRepresenting.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { managedBy, unlessArchived } from "./tournamentOperations.js";
import { AddPair, type AddedPair } from "./AddPair.js";

/**
 * Adding a doubles pair, made from two of the tournament's players. The pair
 * is added as `AddPlayer` adds a player, so that what the tournament asks of
 * any player's name is asked of the pair's, and the two it is made of are left
 * as they are. What the pair represents is made from what the two do. The tournament is asked who may first, and then which players
 * it has, so that a reader who may not is never told who they are.
 */
export class AddPairHandler extends CommandHandler<AddPair, AddedPair> {
  readonly handles: RequestType<AddPair> = AddPair;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddPair): Promise<AddedPair> {
    const { by, tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      command.account,
      command.tournament,
      "AddPair",
    );
    unlessArchived(tournament);
    const first = this.#playerOf(tournament, command.first);
    const second = this.#playerOf(tournament, command.second);
    const id = TournamentPlayerId.create();
    const name = pairName(first.name.toString(), second.name.toString());
    const representing = pairRepresenting(
      first.representing,
      second.representing,
    );
    tournament.addPlayer(
      id,
      { name, ...(representing === undefined ? {} : { representing }) },
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    return { id, name };
  }

  #playerOf(tournament: Tournament, written: string) {
    const id = TournamentPlayerId.from(written);
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
    return player;
  }
}
