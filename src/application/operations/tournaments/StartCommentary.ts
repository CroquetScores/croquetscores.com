import type { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Starting a commentary on a tournament, written by the account that starts
 * it. It is answered with the new commentary's id.
 */
export class StartCommentary extends Command<CommentaryId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the commentary is called, as it was typed. */
    readonly title: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
