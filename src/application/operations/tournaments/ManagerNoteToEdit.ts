import { Query } from "../../common/Query.js";

/** One of a tournament's notes, as the panel that edits it begins. */
export interface ManagerNoteAsItIs {
  readonly title: string;
  /** What it says beneath its title, in Markdown, or nothing. */
  readonly description: string | undefined;
}

/**
 * The note `note` of the tournament `tournament`, as the account the reader
 * is signed in to edits it: asked for by itself, from the note's own stream,
 * once a manager chooses it from a list that holds no description.
 *
 * Only the tournament's managers can ask: anybody else, a scorer among them,
 * is refused with `Tournament.NotAManager`. A tournament there is not is
 * refused as `ManagerNoteToEdit.NoSuchTournament`, and a note it does not
 * have, one of another tournament's or one deleted among them, as
 * `ManagerNoteToEdit.NoSuchManagerNote`. A forgotten account asking is
 * refused with `Account.Forgotten`.
 */
export class ManagerNoteToEdit extends Query<ManagerNoteAsItIs> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The note, by its id. */
    readonly note: string,
  ) {
    super();
  }
}
