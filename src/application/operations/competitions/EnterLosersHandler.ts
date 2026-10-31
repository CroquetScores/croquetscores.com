import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionPlayer } from "../../../domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import { losersOfRound } from "../../../domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentPlayerErrorCode } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { Refused } from "../../../domain/common/Refused.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Competitions,
  competitionFound,
  competitionManagedBy,
  competitionOf,
  toldOf,
} from "./competitionOperations.js";
import { EnterLosers } from "./EnterLosers.js";

type EnterLosersErrorCode =
  "EnterLosers.NotAKnockout" | "EnterLosers.NoSuchRound";

/** What entering the losers of a round refuses, named by its code. */
export class EnterLosersRefused extends Refused<EnterLosersErrorCode> {}

/**
 * Entering the losers of a round of one knockout in a competition. The
 * tournament is asked first, as entering a player asks it, and then the
 * losers are entered one at a time in the order of the matches they lost.
 */
export class EnterLosersHandler extends CommandHandler<EnterLosers, void> {
  readonly handles: RequestType<EnterLosers> = EnterLosers;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(command: EnterLosers): Promise<void> {
    const { by, tournament, competition, told } = await competitionManagedBy(
      this.tournaments,
      this.accounts,
      this.competitions,
      command,
      "EnterLosers",
    );
    const fromId = CompetitionId.from(command.from);
    const source = competitionFound(tournament, fromId);
    if (source.shape.kind !== "knockout") {
      throw new EnterLosersRefused(
        "EnterLosers.NotAKnockout",
        "The losers can only come from a knockout.",
      );
    }
    if (command.round < 0 || command.round >= source.shape.draw.rounds.length) {
      throw new EnterLosersRefused(
        "EnterLosers.NoSuchRound",
        "The knockout has no such round.",
      );
    }
    const losers = losersOfRound(
      (await competitionOf(this.competitions, fromId)).knockoutMatches(
        toldOf(tournament, fromId),
      ),
      command.round,
    );
    for (const loser of losers) {
      // A match not yet decided has no loser to enter yet.
      if (loser.is === "not yet known") continue;
      // Each goes last, rather than where the tournament orders them, because
      // the order of the matches they lost is the order they were asked for.
      if (loser.is === "bye") {
        competition.enterBye(told, by, command.requestedAt);
        continue;
      }
      const player = tournament.players.find((each) =>
        each.id.equals(loser.player.tournamentPlayerId),
      );
      if (player?.archived === true) {
        throw new ValidationError<TournamentPlayerErrorCode>(
          "TournamentPlayer.Archived",
        );
      }
      competition.enterPlayer(
        loser.player.tournamentPlayerId,
        CompetitionPlayer.orderAfter(competition.players),
        told,
        by,
        command.requestedAt,
      );
    }
    // Saved once, after every loser has been entered, so that one the
    // competition refuses leaves it as it was.
    await this.competitions.save(competition);
  }
}
