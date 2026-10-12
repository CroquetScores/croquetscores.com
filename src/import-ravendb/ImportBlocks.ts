import {
  type ImportingCompetitions,
  importCompetition,
  nameOfIn,
} from "./importCompetition.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { Block, Game } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import { Rounds } from "../domain/aggregates/tournaments/value-objects/Rounds.js";
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

// Whether a match of the best of `bestOf` is decided by `played`, the games
// already played between two players, as the site finds it: one of them has
// won more than half, or they have played them all (Competition.ts).
const decidedAfter = (played: readonly Game[], bestOf: number): boolean => {
  const needed = Math.floor(bestOf / 2) + 1;
  const wins = new Map<number, number>();
  for (const game of played) {
    wins.set(game.Winner.PlayerId, (wins.get(game.Winner.PlayerId) ?? 0) + 1);
  }
  return (
    played.length >= bestOf || [...wins.values()].some((won) => won >= needed)
  );
};

/**
 * `games` in the order they were entered, but with the second and third games
 * of a pair added the other way round where the third would come after their
 * match of the best of `bestOf` was decided and the other way round would
 * all be accepted (ImportBlocks.feature). The pairs it did that for are
 * answered too, as the two games, to be said as corrected.
 */
export const secondAndThirdReversed = (
  games: readonly Game[],
  bestOf: number,
): { ordered: Game[]; reversed: readonly [Game, Game][] } =>
  secondAndThirdReversedIn(
    [...games].sort((one, other) => one.Id - other.Id),
    bestOf,
  );

/**
 * As `secondAndThirdReversed`, for `games` already in the order they are to be
 * added in, which is kept apart from the second and third games of each pair
 * it puts the other way round: a team match is added in its own order
 * (ImportTeamMatches.feature).
 */
export const secondAndThirdReversedIn = (
  games: readonly Game[],
  bestOf: number,
): { ordered: Game[]; reversed: readonly [Game, Game][] } => {
  const ordered = [...games];
  const byPair = new Map<string, number[]>();
  ordered.forEach((game, at) => {
    const pair = [game.Winner.PlayerId, game.Loser.PlayerId]
      .sort((one, other) => one - other)
      .join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), at]);
  });
  const reversed: [Game, Game][] = [];
  for (const places of byPair.values()) {
    const [at1, at2, at3] = places;
    if (at1 === undefined || at2 === undefined || at3 === undefined) continue;
    const [first, second, third] = [at1, at2, at3].map((at) => ordered[at]);
    if (first === undefined || second === undefined || third === undefined) {
      continue;
    }
    if (
      !decidedAfter([first, second], bestOf) ||
      decidedAfter([first], bestOf) ||
      decidedAfter([first, third], bestOf)
    ) {
      continue;
    }
    ordered[at2] = third;
    ordered[at3] = second;
    reversed.push([second, third]);
  }
  return { ordered, reversed };
};

// Blocks of a tournament the import names as played in rounds of matches of
// a best-of, by the website and the tournament document, whatever the blocks
// were kept as (ImportBlocks.feature): tournaments/72520, the WCA Sunday GC
// Handicap Interclub, a double round robin of matches of the best of 3.
const NAMED_TOURNAMENTS: ReadonlyMap<
  string,
  { readonly bestOf: number; readonly rounds: number }
> = new Map([
  ["croquetscores.com/tournaments/72520", { bestOf: 3, rounds: 2 }],
]);

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
 * How many rounds a block was played in where every pair of its players, in
 * the order their games were entered, played whole matches of the best of
 * `bestOf` and at least one pair played more than one: the most matches any
 * pair played. Nothing where no pair did, or where any pair's last match was
 * not finished (ImportBlocks.feature).
 */
export const roundsPlayed = (
  games: readonly Game[],
  bestOf: number,
): number | undefined => {
  if (bestOf <= 1) return undefined;
  const byPair = new Map<string, Game[]>();
  for (const game of [...games].sort((one, other) => one.Id - other.Id)) {
    const pair = [game.Winner.PlayerId, game.Loser.PlayerId]
      .sort((one, other) => one - other)
      .join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), game]);
  }
  let most = 0;
  for (const theirs of byPair.values()) {
    let matches = 0;
    let match: Game[] = [];
    for (const game of theirs) {
      match.push(game);
      if (decidedAfter(match, bestOf)) {
        matches += 1;
        match = [];
      }
    }
    if (match.length > 0) return undefined;
    most = Math.max(most, matches);
  }
  return most > 1 ? most : undefined;
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
        // Or, where the import names its tournament, the best-of and the
        // rounds it names, whatever it was kept as.
        const named = NAMED_TOURNAMENTS.get(
          `${read.website}/${document.Tournament.Id}`.toLowerCase(),
        );
        const bestOf =
          named !== undefined
            ? BestOf.from(named.bestOf)
            : inRounds
              ? BestOf.from(1)
              : worked;
        // Or kept as it was, and played in as many rounds as its pairs
        // played whole matches of it.
        const rounds =
          named !== undefined
            ? named.rounds
            : inRounds
              ? undefined
              : roundsPlayed(document.Games._Games, bestOf.games);
        // Tested before any game is added, for a block kept as the best of
        // more than 1 that was not played in rounds: a block that was has
        // second and third games that are the second match's, not misordered.
        const { ordered, reversed } =
          rounds === undefined
            ? secondAndThirdReversed(document.Games._Games, bestOf.games)
            : {
                ordered: [...document.Games._Games].sort(
                  (one, other) => one.Id - other.Id,
                ),
                reversed: [],
              };
        const nameOf = nameOfIn(document);
        return {
          entries,
          gamesInOrder: () => ordered,
          corrected: [
            ...(named !== undefined
              ? [
                  {
                    code: "ImportBlocks.TournamentRounds",
                    says: `was kept as the best of ${String(worked.games)}, and is brought over as the best of ${String(named.bestOf)}, played in ${String(named.rounds)} rounds, as the tournament was played.`,
                  },
                ]
              : []),
            ...(inRounds && named === undefined
              ? [
                  {
                    code: "ImportBlocks.PlayedInRounds",
                    says: `was kept as the best of ${String(worked.games)}, and every pair of its players played ${String(worked.games)} games, so it was played in rounds of single games and is brought over as the best of 1.`,
                  },
                ]
              : []),
            ...(rounds === undefined || named !== undefined
              ? []
              : [
                  {
                    code: "ImportBlocks.PlayedInSeveralRounds",
                    says: `was kept as the best of ${String(bestOf.games)}, and its pairs played it as up to ${String(rounds)} matches each of the best of ${String(bestOf.games)}, a round robin more than once, so it is brought over played in ${String(rounds)} rounds.`,
                  },
                ]),
            ...reversed.map(([second, third]) => ({
              code: "ImportBlocks.GamesReordered",
              what: `games ${String(second.Id)} and ${String(third.Id)}`,
              says: `has the second and third games between ${nameOf(second.Winner.PlayerId)} and ${nameOf(second.Loser.PlayerId)}, games ${String(second.Id)} and ${String(third.Id)}, added the other way round, since the third came after their match of the best of ${String(bestOf.games)} was decided.`,
            })),
          ],
          add: (tournament, id, name, by, at) => {
            tournament.addBlock(
              id,
              name,
              bestOf,
              Rounds.from(rounds ?? 1),
              by,
              at,
            );
          },
        };
      },
    });
  }
}
