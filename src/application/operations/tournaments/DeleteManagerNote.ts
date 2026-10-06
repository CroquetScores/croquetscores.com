import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Deleting one of a tournament's notes, for good, by any of its managers. */
export class DeleteManagerNote extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The note, by its id. */
    readonly note: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
