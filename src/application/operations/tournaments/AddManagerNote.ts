import type { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/**
 * Adding a note to a tournament, by one of its managers. It is answered with
 * the new note's id.
 */
export class AddManagerNote extends Command<ManagerNoteId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the note is called, as it was typed. */
    readonly title: string,
    /** What it says beneath its title, as it was typed; empty for nothing. */
    readonly description: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
