import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CommentId } from "../../../domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentText } from "../../../domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Commentaries,
  commentaryAskedBy,
} from "./commentaryOperations.js";
import { AddComment } from "./AddComment.js";

/** Adding a comment to a commentary. It is answered with the comment's id. */
export class AddCommentHandler extends CommandHandler<AddComment, CommentId> {
  readonly handles: RequestType<AddComment> = AddComment;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly commentaries: Commentaries,
  ) {
    super();
  }

  async handle(command: AddComment): Promise<CommentId> {
    const { by, commentary } = await commentaryAskedBy(
      this.tournaments,
      this.accounts,
      this.commentaries,
      command,
      "AddComment",
    );
    const id = CommentId.create();
    commentary.addComment(
      id,
      CommentText.from(command.text),
      by,
      command.requestedAt,
    );
    await this.commentaries.save(commentary);
    return id;
  }
}
