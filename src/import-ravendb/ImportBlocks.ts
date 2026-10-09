import {
  type ImportingCompetitions,
  importCompetition,
} from "./importCompetition.js";
import type { Block } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { bestOfWorkedOut } from "./bestOfImported.js";

/**
 * Brings the old sites' blocks over as blocks, each the best of what it was, or
 * of what its games say where it was kept as the best of less than 1,
 * with what each player carried forward into it (ImportBlocks.feature). What
 * every competition brings over is importCompetition's.
 */
export class ImportBlocks implements Importer<Block> {
  readonly collection = "Blocks";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Block>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: true,
      // A bye has no place in a block, which has no draw: the site has byes
      // only in a knockout, so one the old sites listed here is left out.
      shape: (document, listed) => ({
        entries: listed.filter((entry) => !entry.bye),
        add: (tournament, id, name, by, at) => {
          tournament.addBlock(
            id,
            name,
            bestOfWorkedOut(document.BestOf, document.Games._Games),
            by,
            at,
          );
        },
      }),
    });
  }
}
