import type { ImportReport } from "../application/operations/world-rankings/ImportWorldRankingPlayers.js";
import {
  type Importing,
  importWorldRankingPlayers,
} from "../application/operations/world-rankings/importingWorldRankingPlayers.js";
import type {
  WorldRankingListsErrorCode,
  WorldRankingSport,
} from "../application/services/WorldRankingLists.js";

/** A list that was not read, and what it was refused with. */
export interface ListNotRead {
  readonly sport: WorldRankingSport;
  readonly code: WorldRankingListsErrorCode;
}

/**
 * Imports the players the world rankings know, once the old sites are over
 * (ImportWorldRankingPlayerNames.feature). The import empties the database
 * first, and the players with it, so without this the player dialogs would
 * offer nobody until an administrator imported them from their page.
 *
 * Read and kept as the administrator's page reads and keeps them, by the one
 * function both use. Nobody asks but the import, so nobody is asked whether
 * they are an administrator.
 */
export class ImportWorldRankingPlayerNames {
  constructor(private readonly importing: Importing) {}

  /**
   * Reads both lists and keeps the players on each that is read in full,
   * telling `report` each thing done as it is done. Answers the lists that
   * were not read, so that the import can count them among its errors.
   */
  async import(
    report: (report: ImportReport) => void = () => undefined,
  ): Promise<readonly ListNotRead[]> {
    const notRead: ListNotRead[] = [];
    await importWorldRankingPlayers(this.importing, (said) => {
      if (said.kind === "refused") {
        notRead.push({ sport: said.sport, code: said.code });
      }
      report(said);
    });
    return notRead;
  }
}
