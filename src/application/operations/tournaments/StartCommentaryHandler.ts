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
import type { TournamentCommentaries } from "./tournamentForReaders.js";
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
    private readonly listed: TournamentCommentaries,
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
    tournament.allowWritingCommentary();
    const id = CommentaryId.create();
    // Kept in a stream of its own, told the titles and slugs the tournament's
    // other commentaries have, forgotten writers' among them, by the read
    // model of them.
    await this.commentaries.save(
      Commentary.start(
        id,
        tournament.id,
        CommentaryTitle.from(command.title),
        await this.listed.taken(tournament.id),
        by,
        command.requestedAt,
      ),
    );
    return id;
  }
}
