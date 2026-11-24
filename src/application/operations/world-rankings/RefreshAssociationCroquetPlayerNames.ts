import { Command } from "../../common/Command.js";
import type { RunsItsOwnTransactions } from "../../common/RunsItsOwnTransactions.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Reading the association croquet list of the players the world rankings know
 * and keeping them, for the list of those players to do when it is asked for
 * from the start (worldRankingPlayers.feature).
 *
 * Nobody signs in to ask for it, which is why it is not the import the
 * administrator asks for: that one needs an administrator and reads both
 * lists. It runs its own transactions for the same reason that one does.
 */
export class RefreshAssociationCroquetPlayerNames
  extends Command<void>
  implements RunsItsOwnTransactions
{
  readonly runsItsOwnTransactions = true;

  constructor(
    requestedAt: ReadOnlyDate,
    /** The host of the website it was asked on. */
    readonly website: string,
  ) {
    super(requestedAt);
  }
}
