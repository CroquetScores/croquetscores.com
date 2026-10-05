import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Deleting one of a commentary's comments, for good, by its writer. */
export class DeleteComment extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The commentary, by its id. */
    readonly commentary: string,
    /** The comment, by its id. */
    readonly comment: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
