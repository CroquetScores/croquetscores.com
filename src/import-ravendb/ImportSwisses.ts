import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import {
  type ImportingCompetitions,
  importCompetition,
} from "./importCompetition.js";
import type { Swiss } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";

// The old sites played a Swiss a game at a time and kept no best-of for one.
const SINGLE_GAMES = 1;

/**
 * Brings the old sites' Swisses over as Swisses of single games, with what
 * each player carried forward into it (ImportSwisses.feature). The earlier
 * competitions a Swiss could be said to count, which only the database ever
 * said, are left behind.
 */
export class ImportSwisses implements Importer<Swiss> {
  readonly collection = "Swisses";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Swiss>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: true,
      shape: (_document, listed) => ({
        entries: listed,
        add: (tournament, id, name, by, at) => {
          tournament.addSwiss(id, name, BestOf.from(SINGLE_GAMES), by, at);
        },
      }),
    });
  }
}
