import { Command } from "../../common/Command.js";
import type { RunsItsOwnTransactions } from "../../common/RunsItsOwnTransactions.js";
import type {
  WorldRankingListsErrorCode,
  WorldRankingSport,
} from "../../services/WorldRankingLists.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** One thing the import says about how it is going, as it goes. */
export type ImportReport =
  | { readonly kind: "reading"; readonly sport: WorldRankingSport }
  | {
      readonly kind: "read";
      readonly sport: WorldRankingSport;
      readonly players: number;
    }
  | {
      readonly kind: "kept";
      readonly sport: WorldRankingSport;
      readonly players: number;
    }
  | {
      readonly kind: "refused";
      readonly sport: WorldRankingSport;
      readonly code: WorldRankingListsErrorCode;
      /** Why, for whoever reads a log rather than for a reader of the site. */
      readonly message: string;
    }
  | { readonly kind: "finished" };

/**
 * Importing the players the world rankings know, both sports' lists, as an
 * administrator asks for it (ImportWorldRankingPlayers.feature).
 *
 * It runs its own transactions: reading a list takes as long as the rankings'
 * site takes, and a transaction held open across that would hold a connection
 * doing nothing.
 */
export class ImportWorldRankingPlayers
  extends Command<void>
  implements RunsItsOwnTransactions
{
  readonly runsItsOwnTransactions = true;

  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /**
     * Told each thing the import says, as it says it, so that whoever asked
     * can pass it on while the rest is still being read.
     */
    readonly report: (report: ImportReport) => void,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
