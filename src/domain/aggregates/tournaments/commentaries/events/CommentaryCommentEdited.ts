import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of the commentary's comments was edited to say `text`. When it was
 * last edited is when this occurred.
 */
export class CommentaryCommentEdited extends DomainEvent {
  constructor(
    readonly commentId: string,
    readonly text: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
