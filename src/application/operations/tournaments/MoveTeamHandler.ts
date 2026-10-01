import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { MoveTeam } from "./MoveTeam.js";

/**
 * Moving one of a tournament's teams up or down a place. Where it goes and
 * what order it is given are the tournament's to say.
 */
export class MoveTeamHandler extends CommandHandler<MoveTeam, void> {
  readonly handles: RequestType<MoveTeam> = MoveTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: MoveTeam): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "MoveTeam",
    );
    tournament.moveTeam(
      TeamId.from(command.team),
      // Up or down, and nothing else, once the validator has let it in.
      command.direction === "up" ? "up" : "down",
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
