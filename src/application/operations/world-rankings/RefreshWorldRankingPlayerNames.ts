import { Command } from "../../common/Command.js";
import type { RunsItsOwnTransactions } from "../../common/RunsItsOwnTransactions.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { WorldRankingSport } from "../../services/WorldRankingLists.js";

/**
 * Reading one sport's list of the players the world rankings know and keeping
 * them, for the list of that sport's players to do when it is asked for from
 * the start (worldRankingPlayers.feature, in `ac/` and in `gc/`).
 *
 * Nobody signs in to ask for it, which is why it is not the import the
 * administrator asks for: that one needs an administrator and reads both
 * lists. It runs its own transactions for the same reason that one does.
 */
export class RefreshWorldRankingPlayerNames
  extends Command<void>
  implements RunsItsOwnTransactions
{
  readonly runsItsOwnTransactions = true;

  constructor(
    requestedAt: ReadOnlyDate,
    /** The host of the website it was asked on. */
    readonly website: string,
    /** The sport whose list is read, and no other. */
    readonly sport: WorldRankingSport,
  ) {
    super(requestedAt);
  }
}
