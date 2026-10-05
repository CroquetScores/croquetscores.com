import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { CommentaryTitle } from "../../../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ChangeCommentaryTitle } from "./ChangeCommentaryTitle.js";

/**
 * Changing a commentary's title. Who may is the tournament's to say, since it
 * knows who started each commentary.
 */
export class ChangeCommentaryTitleHandler extends CommandHandler<
  ChangeCommentaryTitle,
  void
> {
  readonly handles: RequestType<ChangeCommentaryTitle> = ChangeCommentaryTitle;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ChangeCommentaryTitle): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ChangeCommentaryTitle",
    );
    tournament.changeCommentaryTitle(
      CommentaryId.from(command.commentary),
      CommentaryTitle.from(command.title),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
  }
}
