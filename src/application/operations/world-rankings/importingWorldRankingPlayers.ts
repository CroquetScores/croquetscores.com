// Reading the world rankings' lists and keeping the players on each, which
// the administrator's page asks for (ImportWorldRankingPlayers.feature) and
// the import from the old sites does once it is done
// (ImportWorldRankingPlayerNames.feature). Written once, so that the two
// cannot come to keep the players by different rules.
import type { Transactions } from "../../services/Transactions.js";
import {
  ListRefused,
  type WorldRankingLists,
  worldRankingSports,
} from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import type { ImportReport } from "./ImportWorldRankingPlayers.js";

/** What reading the lists and keeping their players needs. */
export interface WorldRankingImportParts {
  readonly lists: WorldRankingLists;
  readonly players: WorldRankingPlayers;
  readonly transactions: Transactions;
}

/**
 * Reads each sport's list in turn and keeps the players on it, telling
 * `report` each thing done as it is done, a list that was not read with
 * its code and why, so that whoever is told can say it as it happens.
 *
 * Each list is read with nothing held, and only a list read in full is kept,
 * in a transaction of its own, so that one sport's list failing leaves its
 * players as they were and the other's is still kept. Run outside any
 * transaction, since it opens its own.
 */
export const importWorldRankingPlayers = async (
  { lists, players, transactions }: WorldRankingImportParts,
  report: (report: ImportReport) => void,
): Promise<void> => {
  for (const sport of worldRankingSports) {
    report({ kind: "reading", sport });
    let names: readonly string[];
    try {
      names = await lists.playersOf(sport);
    } catch (failure) {
      // Only a list that was not read is said and passed over. Anything else
      // is the site failing, and stops the import where it is.
      if (!(failure instanceof ListRefused)) throw failure;
      report({
        kind: "refused",
        sport,
        code: failure.code,
        message: failure.message,
      });
      continue;
    }
    report({ kind: "read", sport, players: names.length });
    await transactions.inTransaction(() => players.replace(sport, names));
    report({ kind: "kept", sport, players: names.length });
  }
  report({ kind: "finished" });
};
