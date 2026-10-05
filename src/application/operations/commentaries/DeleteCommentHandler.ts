import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CommentId } from "../../../domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Commentaries,
  commentaryAskedBy,
} from "./commentaryOperations.js";
import { DeleteComment } from "./DeleteComment.js";

/** Deleting one of a commentary's comments. */
export class DeleteCommentHandler extends CommandHandler<DeleteComment, void> {
  readonly handles: RequestType<DeleteComment> = DeleteComment;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly commentaries: Commentaries,
  ) {
    super();
  }

  async handle(command: DeleteComment): Promise<void> {
    const { by, commentary } = await commentaryAskedBy(
      this.tournaments,
      this.accounts,
      this.commentaries,
      command,
      "DeleteComment",
    );
    commentary.deleteComment(
      CommentId.from(command.comment),
      by,
      command.requestedAt,
    );
    await this.commentaries.save(commentary);
  }
}
