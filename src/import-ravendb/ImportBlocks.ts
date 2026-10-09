import {
  type ImportingCompetitions,
  importCompetition,
} from "./importCompetition.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { Block } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import { bestOfWorkedOut, metPastTheirMatch } from "./bestOfImported.js";

// Blocks of a tournament that finished before this are left behind where
// nothing was entered in them or played (ImportBlocks.feature).
const UNUSED_BEFORE = Date.UTC(2026, 9, 1);

// Whether `document` is a block added and never used, no player entered and
// no game played, of a tournament that finished before UNUSED_BEFORE. One of
// a tournament finishing then or later may yet be filled.
const isUnused = (document: Block, tournament: Tournament): boolean =>
  document.Players._Players.length === 0 &&
  document.Games._Games.length === 0 &&
  tournament.finishes.toDate().getTime() < UNUSED_BEFORE;

/**
 * Brings the old sites' blocks over as blocks, each the best of what it was, or
 * of what its games say where it was kept as the best of less than 1, or of 1
 * where two of its players met again once their match was decided, which is
 * said as accepted, with what each player carried forward into it
 * (ImportBlocks.feature). What every competition brings over is
 * importCompetition's.
 */
export class ImportBlocks implements Importer<Block> {
  readonly collection = "Blocks";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Block>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: true,
      // A bye has no place in a block, which has no draw: the site has byes
      // only in a knockout, so one the old sites listed here is left out.
      shape: (document, listed, inTournament) => {
        if (isUnused(document, inTournament)) return undefined;
        const worked = bestOfWorkedOut(document.BestOf, document.Games._Games);
        // Played in rounds, each game its own match, where two players met
        // again once their match was decided.
        const inRounds =
          worked.games > 1 && metPastTheirMatch(document.Games._Games, worked);
        const bestOf = inRounds ? BestOf.from(1) : worked;
        return {
          entries: listed.filter((entry) => !entry.bye),
          accepted: inRounds
            ? [
                {
                  what: "",
                  code: "ImportBlocks.PlayedInRounds",
                  why: `Kept as the best of ${String(worked.games)}, and two of its players met again once their match was decided, so brought over as the best of 1, played in rounds.`,
                },
              ]
            : [],
          add: (tournament, id, name, by, at) => {
            tournament.addBlock(id, name, bestOf, by, at);
          },
        };
      },
    });
  }
}
