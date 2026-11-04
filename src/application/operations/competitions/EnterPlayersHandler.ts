import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Refused } from "../../../domain/common/Refused.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import {
  type Competitions,
  competitionManagedBy,
  enterTournamentPlayer,
} from "./competitionOperations.js";
import { EnterPlayers, type EnterPlayersAnswer } from "./EnterPlayers.js";

// What holds for the whole list rather than for one player in it: the
// players of a losers knockout are put there as its matches are decided, so
// nobody is entered by hand whoever is asked about. Anything else a player is
// refused for is that player's, including a refusal this list was not written
// knowing of, so that one player's refusal is said of them and does not end
// the asking for all.
const holdsForEveryPlayer = ["Competition.PlayersSetAutomatically"];

// The code a player was refused with, or nothing where what was thrown is not
// a refusal at all, and is a mistake that should end the asking.
const refusedWith = (failure: unknown): string | undefined => {
  const code =
    failure instanceof Refused || failure instanceof ValidationError
      ? (failure as { readonly code: string }).code
      : undefined;
  return code === undefined || holdsForEveryPlayer.includes(code)
    ? undefined
    : code;
};

/**
 * Entering several of a tournament's players in one of its competitions, in
 * the order they were listed.
 *
 * They are all entered in the one competition as it stands in memory and it is
 * saved once, so that a player who cannot be entered leaves nobody entered:
 * nothing was kept before it. Each is entered after the ones before it, so a
 * player listed twice is already in by the second time, and a knockout's draw
 * fills as the list goes.
 *
 * Every player who cannot be entered is reported, not only the first, which
 * is why their refusal is caught here and the rest still asked. They are
 * refused as the rules in the validator are, so that the caller reads them the
 * same way. Where `enterWhatCan` is so, the players who can be are entered and
 * the rest left out, and said in the answer; where there are none, there is
 * nothing to enter, and it is refused as it would be whole or nothing.
 */
export class EnterPlayersHandler extends CommandHandler<
  EnterPlayers,
  EnterPlayersAnswer
> {
  readonly handles: RequestType<EnterPlayers> = EnterPlayers;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: EnterPlayers): Promise<EnterPlayersAnswer> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "EnterPlayers",
    );
    const entered: string[] = [];
    const refused: BrokenRule[] = [];
    command.playerIds.forEach((written, place) => {
      try {
        entered.push(
          enterTournamentPlayer(
            tournament,
            competition,
            TournamentPlayerId.from(written),
            told,
            by,
            command.requestedAt,
          ).value,
        );
      } catch (failure) {
        const code = refusedWith(failure);
        if (code === undefined) throw failure;
        refused.push({ code, fields: [`players.${String(place)}`] });
      }
    });
    if (refused.length > 0 && (!command.enterWhatCan || entered.length === 0)) {
      throw new RequestInvalid(command, refused);
    }
    await this.competitions.save(competition);
    return { entered, refused };
  }
}
