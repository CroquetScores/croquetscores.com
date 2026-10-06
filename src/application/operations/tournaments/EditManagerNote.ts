import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Editing one of a tournament's notes, by any of its managers. */
export class EditManagerNote extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The note, by its id. */
    readonly note: string,
    /** What the note is to be called, as it was typed. */
    readonly title: string,
    /** What it is to say beneath its title, as it was typed; empty for nothing. */
    readonly description: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
