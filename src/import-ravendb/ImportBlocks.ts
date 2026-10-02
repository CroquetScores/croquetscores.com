import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import {
  type ImportingCompetitions,
  importCompetition,
} from "./importCompetition.js";
import type { Block } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/**
 * Brings the old sites' blocks over as blocks, each the best of what it was,
 * with what each player carried forward into it (ImportBlocks.feature). What
 * every competition brings over is importCompetition's.
 */
export class ImportBlocks implements Importer<Block> {
  readonly collection = "Blocks";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Block>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: true,
      shape: (document, listed) => ({
        entries: listed,
        add: (tournament, id, name, by, at) => {
          tournament.addBlock(id, name, BestOf.from(document.BestOf), by, at);
        },
      }),
    });
  }
}
