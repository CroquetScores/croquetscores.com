import type { ImportReport } from "../application/operations/world-rankings/ImportWorldRankingPlayers.js";
import {
  importWorldRankingPlayers,
  type ListNotRead,
  type WorldRankingImportParts,
} from "../application/operations/world-rankings/importingWorldRankingPlayers.js";

export type { ListNotRead };

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
  constructor(private readonly parts: WorldRankingImportParts) {}

  /**
   * Reads both lists and keeps the players on each that is read in full,
   * telling `report` each thing done as it is done. Answers the lists that
   * were not read, so that the import can say why and count them among its
   * errors.
   */
  import(
    report: (report: ImportReport) => void = () => undefined,
  ): Promise<readonly ListNotRead[]> {
    return importWorldRankingPlayers(this.parts, report);
  }
}
