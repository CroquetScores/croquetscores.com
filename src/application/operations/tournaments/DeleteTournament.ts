import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Deleting a test tournament, as an administrator judges it: telling its
 * managers so in words the administrator wrote, and archiving it where that is
 * asked (DeleteTournament.feature). It names the account the reader is signed
 * in to, and the tournament by its id.
 *
 * "Deleting" is the administrator's word for it. Nothing the site keeps is ever
 * deleted, so what is done to the tournament is archiving it, which can be put
 * back.
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class DeleteTournament extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the managers are told, as it was typed. */
    readonly message: string,
    /** Whether the tournament is archived as well as its managers told. */
    readonly archive: boolean,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
