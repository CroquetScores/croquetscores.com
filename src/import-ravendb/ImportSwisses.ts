import { hasTieMarked } from "./tiesMarked.js";
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
 * competitions a Swiss counted as its own are not brought over into it: what
 * their games came to is carried forward by the players who played them
 * (carriedForwardGames.feature).
 */
export class ImportSwisses implements Importer<Swiss> {
  readonly collection = "Swisses";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Swiss>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: true,
      countsGamesOf: (document) =>
        (document.CarryForwardCompetitions ?? []).map(({ Id }) => Id),
      // A bye has no place in a Swiss, which has no draw: the site has byes
      // only in a knockout, so one the old sites listed here is left out.
      shape: (document, listed) => ({
        entries: listed.filter((entry) => !entry.bye),
        add: (tournament, id, name, by, at) => {
          tournament.addSwiss(id, name, BestOf.from(SINGLE_GAMES), by, at, {
            drawsAllowed: hasTieMarked(document),
          });
        },
      }),
    });
  }
}
