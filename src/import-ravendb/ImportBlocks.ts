import {
  type ImportingCompetitions,
  importCompetition,
} from "./importCompetition.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { Block, Game } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import { bestOfWorkedOut } from "./bestOfImported.js";

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
 * Whether every pair of the `players` of a block played exactly `bestOf`
 * games of `games` between them, and no pair or player more: the block was
 * played in rounds of single games, whatever it was kept as the best of
 * (ImportBlocks.feature).
 */
const playedInRounds = (
  players: readonly number[],
  games: readonly Game[],
  bestOf: number,
): boolean => {
  if (bestOf <= 1 || players.length < 2) return false;
  const between = new Map<string, number>();
  for (const game of games) {
    const pair = [game.Winner.PlayerId, game.Loser.PlayerId]
      .sort((one, other) => one - other)
      .join(" ");
    between.set(pair, (between.get(pair) ?? 0) + 1);
  }
  const pairs = (players.length * (players.length - 1)) / 2;
  return (
    between.size === pairs &&
    [...between.values()].every((count) => count === bestOf) &&
    players.every((one) =>
      players.every(
        (other) =>
          one === other ||
          between.has([one, other].sort((a, b) => a - b).join(" ")),
      ),
    )
  );
};

/**
 * Brings the old sites' blocks over as blocks, each the best of what it was, or
 * of what its games say where it was kept as the best of less than 1, or the
 * best of 1 where it was kept as the best of more than 1 and every pair of
 * its players played as many games as that, which is said as corrected, with what each player carried
 * forward into it (ImportBlocks.feature). What every competition brings over
 * is importCompetition's.
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
        const entries = listed.filter((entry) => !entry.bye);
        const worked = bestOfWorkedOut(document.BestOf, document.Games._Games);
        // Kept as the best of more than 1 and played as that many rounds of
        // single games, which the site finds decided after the match's
        // second win. A best-of worked out from the games is not kept.
        const inRounds = playedInRounds(
          entries.flatMap((entry) => (entry.bye ? [] : [entry.player._Id])),
          document.Games._Games,
          document.BestOf,
        );
        const bestOf = inRounds ? BestOf.from(1) : worked;
        return {
          entries,
          corrected: inRounds
            ? [
                {
                  code: "ImportBlocks.PlayedInRounds",
                  says: `was kept as the best of ${String(worked.games)}, and every pair of its players played ${String(worked.games)} games, so it was played in rounds of single games and is brought over as the best of 1.`,
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
