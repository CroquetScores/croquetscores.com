import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionRefused } from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
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
import { EnterPlayers } from "./EnterPlayers.js";

// What is the fault of one player in the list, rather than of every player
// alike: any other refusal (that the reader does not manage the tournament,
// that the competition's players are set automatically) holds for the whole
// list and ends the asking.
const aboutOnePlayer = (failure: unknown): string | undefined => {
  if (failure instanceof CompetitionRefused) {
    return [
      "Competition.PlayerAlreadyEntered",
      "Competition.DrawFixed",
      "Competition.DrawFull",
    ].includes(failure.code)
      ? failure.code
      : undefined;
  }
  if (
    failure instanceof TournamentRefused &&
    failure.code === "Tournament.NoSuchPlayer"
  ) {
    return failure.code;
  }
  if (
    failure instanceof ValidationError &&
    (failure as ValidationError<string>).code === "TournamentPlayer.Archived"
  ) {
    return "TournamentPlayer.Archived";
  }
  return undefined;
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
 * the rest left out; where there are none, there is nothing to enter, and it
 * is refused as it would be whole or nothing.
 */
export class EnterPlayersHandler extends CommandHandler<
  EnterPlayers,
  readonly string[]
> {
  readonly handles: RequestType<EnterPlayers> = EnterPlayers;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: EnterPlayers): Promise<readonly string[]> {
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
        const code = aboutOnePlayer(failure);
        if (code === undefined) throw failure;
        refused.push({ code, fields: [`players.${String(place)}`] });
      }
    });
    if (refused.length > 0 && (!command.enterWhatCan || entered.length === 0)) {
      throw new RequestInvalid(command, refused);
    }
    await this.competitions.save(competition);
    return entered;
  }
}
