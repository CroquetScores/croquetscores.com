import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a comment was added to the commentary, saying what it says, with its
 * tags already taken out. When it was written is when this occurred.
 */
export class CommentaryCommentAdded extends DomainEvent {
  constructor(
    readonly commentId: string,
    readonly text: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
