import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Games } from "../../services/Games.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { KnockoutDraw } from "../../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { UpdateKnockout } from "./UpdateKnockout.js";

/**
 * Correcting one of a tournament's knockouts: its name, and the shape of its
 * draw, said again. Whether the change moves a player who has played is asked
 * of the application's games.
 */
export class UpdateKnockoutHandler extends CommandHandler<
  UpdateKnockout,
  void
> {
  readonly handles: RequestType<UpdateKnockout> = UpdateKnockout;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(command: UpdateKnockout): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "UpdateKnockout",
    );
    const competition = CompetitionId.from(command.competition);
    const draw = KnockoutDraw.from(command.places, command.rounds);
    tournament.updateKnockout(
      competition,
      CompetitionName.from(command.name),
      draw,
      await this.games.movesAPlayerWhoHasPlayed(
        tournament.id,
        competition,
        draw,
      ),
      await this.games.knockoutRoundsPlayed(tournament.id, competition),
      by,
      command.requestedAt,
      command.rules,
    );
    await this.tournaments.save(tournament);
  }
}
