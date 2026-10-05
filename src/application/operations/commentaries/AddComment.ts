import type { CommentId } from "../../../domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Adding a comment to a commentary, by its writer. It is answered with the new
 * comment's id.
 */
export class AddComment extends Command<CommentId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The commentary, by its id. */
    readonly commentary: string,
    /** What the comment says, in Markdown, as it was typed. */
    readonly text: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
