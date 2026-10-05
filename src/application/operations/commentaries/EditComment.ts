import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Editing one of a commentary's comments, by its writer. */
export class EditComment extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The commentary, by its id. */
    readonly commentary: string,
    /** The comment, by its id. */
    readonly comment: string,
    /** What the comment is to say now, in Markdown, as it was typed. */
    readonly text: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
