import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Taking away a tournament's national or international status, as an
 * administrator judges it neither, and telling its managers so
 * (RemoveNotableStatus.feature). It names the account the reader is signed in
 * to, and the tournament by its id.
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class RemoveNotableStatus extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
