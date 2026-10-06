import { Query } from "../../common/Query.js";
import type { ManagerNoteHeading } from "./managerNoteOperations.js";

/**
 * The notes of the tournament `tournament`, the most recently written first,
 * as the account the reader is signed in to lists them to edit or delete:
 * each without what it says, which a list has no use for. It names that
 * account and never one the reader chose.
 *
 * Only the tournament's managers can ask, since the list is for managing its
 * notes: anybody else, a scorer among them, is refused with
 * `Tournament.NotAManager`. A tournament there is not is refused as
 * `ManagerNotesOfTournament.NoSuchTournament`, and a forgotten account asking
 * is refused with `Account.Forgotten`.
 */
export class ManagerNotesOfTournament extends Query<
  readonly ManagerNoteHeading[]
> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
