import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Commentary } from "../../../domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { CommentaryTitle } from "../../../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Commentaries } from "../commentaries/commentaryOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { StartCommentary } from "./StartCommentary.js";

/**
 * Starting a commentary on a tournament, by any account. The tournament
 * records it, and its own record is started beside it under the same id,
 * naming its writer; both are kept in the command's transaction, or neither
 * is. It is answered with the commentary's id.
 */
export class StartCommentaryHandler extends CommandHandler<
  StartCommentary,
  CommentaryId
> {
  readonly handles: RequestType<StartCommentary> = StartCommentary;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly commentaries: Commentaries,
  ) {
    super();
  }

  async handle(command: StartCommentary): Promise<CommentaryId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "StartCommentary",
    );
    const id = CommentaryId.create();
    tournament.startCommentary(
      id,
      CommentaryTitle.from(command.title),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);
    await this.commentaries.save(Commentary.start(id, by, command.requestedAt));
    return id;
  }
}
