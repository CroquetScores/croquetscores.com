import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Changing a commentary's title, by its writer. */
export class ChangeCommentaryTitle extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The commentary, by its id. */
    readonly commentary: string,
    /** What the commentary is to be called, as it was typed. */
    readonly title: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
