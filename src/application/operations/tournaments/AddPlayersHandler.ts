import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddPlayers } from "./AddPlayers.js";

/**
 * Adding several players to a tournament, in the order they were given.
 *
 * They are all added to the one tournament as it stands in memory and it is
 * saved once, so that a player who breaks a rule leaves nobody added: nothing
 * was kept before it. Each is added after the ones before it, so a name an
 * earlier player in the list has is taken, as one the tournament had is.
 *
 * Every name that is taken is reported, not only the first, which is why a
 * refusal for it is caught here and the rest still asked. It is refused as the
 * rules in the validator are, so that the caller reads them the same way. Any
 * other refusal (that the reader does not manage the tournament, that it is
 * archived) holds for every player alike and ends the asking.
 */
export class AddPlayersHandler extends CommandHandler<
  AddPlayers,
  readonly TournamentPlayerId[]
> {
  readonly handles: RequestType<AddPlayers> = AddPlayers;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddPlayers): Promise<readonly TournamentPlayerId[]> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddPlayers",
    );
    const ids: TournamentPlayerId[] = [];
    const taken: BrokenRule[] = [];
    command.players().forEach((player, place) => {
      const id = TournamentPlayerId.create();
      try {
        tournament.addPlayer(id, player, by, command.requestedAt);
        ids.push(id);
      } catch (failure) {
        if (
          failure instanceof TournamentRefused &&
          failure.code === "Tournament.PlayerNameTaken"
        ) {
          taken.push({
            code: failure.code,
            fields: [`rows.${String(place)}`],
          });
          return;
        }
        throw failure;
      }
    });
    if (taken.length > 0) throw new RequestInvalid(command, taken);
    await this.tournaments.save(tournament);
    return ids;
  }
}
