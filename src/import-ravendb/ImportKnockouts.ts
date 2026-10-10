import { KnockoutDraw } from "../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import {
  type ImportingCompetitions,
  type Listed,
  type Shaped,
  gamesInOrder,
  importCompetition,
} from "./importCompetition.js";
import type { Game, Knockout } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";

const BYE: Listed = { bye: true };

const isPowerOfTwo = (places: number): boolean =>
  Number.isSafeInteger(places) && places >= 2 && (places & (places - 1)) === 0;

const isBetween = (game: Game, one: number, other: number): boolean =>
  (game.Winner.PlayerId === one && game.Loser.PlayerId === other) ||
  (game.Winner.PlayerId === other && game.Loser.PlayerId === one);

// Whom the player numbered `number` played in their first game, if anybody.
const firstOpponentOf = (
  number: number,
  games: readonly Game[],
): number | undefined => {
  const first = games.find(
    (game) => game.Winner.PlayerId === number || game.Loser.PlayerId === number,
  );
  if (first === undefined) return undefined;
  return first.Winner.PlayerId === number
    ? first.Loser.PlayerId
    : first.Winner.PlayerId;
};

/**
 * The places of a knockout whose players do not fill it, with the byes the
 * old sites' managers left out put where the games say they stood
 * (ImportKnockouts.feature): going down the list, a player stands with the
 * player listed after them where each played the other in their first game,
 * and against a bye where they did not. A bye the old sites listed stands
 * where it was listed, beside whoever was listed with it.
 */
const withByesWorkedOut = (
  listed: readonly Listed[],
  games: readonly Game[],
): Listed[] => {
  const places: Listed[] = [];
  for (let at = 0; at < listed.length;) {
    const one = listed[at];
    const next = listed[at + 1];
    if (one === undefined) break;
    if (one.bye || next?.bye === true) {
      places.push(one, next ?? BYE);
      at += 2;
    } else if (
      next !== undefined &&
      firstOpponentOf(one.player._Id, games) === next.player._Id &&
      firstOpponentOf(next.player._Id, games) === one.player._Id
    ) {
      places.push(one, next);
      at += 2;
    } else {
      places.push(one, BYE);
      at += 1;
    }
  }
  return places;
};

// Made odd by one more where it is even, as the old sites made a best-of.
const odd = (games: number): number => (games % 2 === 0 ? games + 1 : games);

/**
 * What each round of a knockout drawn as `places` is the best of, the first
 * round first, worked out from its games as the old sites worked it out each
 * time they showed one: what the longest match of the round needed, made odd,
 * and never fewer than the round before. A match needed as many games as were
 * played in it, and as many as make a winner of whoever won it, which takes
 * one more than half the best-of, so three wins make it at least a best of 5.
 * A round with no games is the best of
 * what the round before was, or of 1 where it is the first. And which round
 * each game is of, by its number, for the games to be added round by round,
 * and which players lost a match, so are knocked out.
 *
 * A match's games are the games between its two players not already given to
 * a match, and its winner is whoever won more of them, or whoever met a bye.
 */
const roundsOf = (
  places: readonly Listed[],
  games: readonly Game[],
): {
  readonly rounds: number[];
  readonly roundOf: Map<number, number>;
  readonly knockedOut: Set<number>;
} => {
  const used = new Set<number>();
  const rounds: number[] = [];
  const roundOf = new Map<number, number>();
  const knockedOut = new Set<number>();
  let standing: (number | "bye" | undefined)[] = places.map((place) =>
    place.bye ? "bye" : place.player._Id,
  );
  // A player marked withdrawn who played no game against whoever they were
  // drawn against lost that match, as the site has it (KnockoutPlay.ts).
  const withdrawn = new Set(
    places.flatMap((place) =>
      !place.bye && place.player.IsWithdrawn ? [place.player._Id] : [],
    ),
  );
  while (standing.length > 1) {
    let most = 0;
    const through: (number | "bye" | undefined)[] = [];
    for (let at = 0; at < standing.length; at += 2) {
      const one = standing[at];
      const other = standing[at + 1];
      if (typeof one === "number" && typeof other === "number") {
        const played = games.filter(
          (game) => !used.has(game.Id) && isBetween(game, one, other),
        );
        for (const game of played) {
          used.add(game.Id);
          roundOf.set(game.Id, rounds.length);
        }
        const won = (number: number): number =>
          played.filter((game) => game.Winner.PlayerId === number).length;
        const byGames =
          won(one) > won(other)
            ? one
            : won(other) > won(one)
              ? other
              : undefined;
        // Where no game decided it, whoever of the two did not withdraw won,
        // if only one of them did.
        const winner =
          byGames ??
          (withdrawn.has(one) && !withdrawn.has(other)
            ? other
            : withdrawn.has(other) && !withdrawn.has(one)
              ? one
              : undefined);
        // As many games as were played, and as many as the winner's wins
        // need: two wins decide a best of 3, three a best of 5.
        most = Math.max(
          most,
          played.length,
          byGames === undefined ? 0 : 2 * won(byGames) - 1,
        );
        if (winner !== undefined) knockedOut.add(winner === one ? other : one);
        through.push(winner);
      } else if (one === "bye") {
        through.push(other);
      } else if (other === "bye") {
        through.push(one);
      } else {
        through.push(undefined);
      }
    }
    const before = rounds.at(-1) ?? 1;
    rounds.push(Math.max(before, most === 0 ? before : odd(most)));
    standing = through;
  }
  return { rounds, roundOf, knockedOut };
};

/**
 * Whether `game` is a play-off: given to no match of the draw, and between two
 * players who have each lost a match of it already, as a game for third place
 * between the losers of the semi-finals is (ImportKnockouts.feature). The
 * site's knockout has no place for one, so it is left out, and that is not an
 * error.
 */
const isPlayOff = (
  game: Game,
  roundOf: ReadonlyMap<number, number>,
  knockedOut: ReadonlySet<number>,
): boolean =>
  !roundOf.has(game.Id) &&
  knockedOut.has(game.Winner.PlayerId) &&
  knockedOut.has(game.Loser.PlayerId);

/**
 * `games` round by round, the first round first, and each round's in the
 * order the old sites numbered them (ImportKnockouts.feature): a match the old
 * site finished late, after the next round was played, is still added before
 * the next round's games, which its winner is drawn into. A game given to no
 * match comes last, in the order it was numbered, to be refused as it would be
 * anywhere.
 */
const roundByRound = (
  games: readonly Game[],
  roundOf: ReadonlyMap<number, number>,
): Game[] =>
  gamesInOrder(games).sort(
    (one, other) =>
      (roundOf.get(one.Id) ?? Number.MAX_SAFE_INTEGER) -
      (roundOf.get(other.Id) ?? Number.MAX_SAFE_INTEGER),
  );

// How many of `games` the knockout drawn as `places` has no place for: given to
// no match of its draw, and not play-offs either.
const misfitsOf = (
  places: readonly Listed[],
  games: readonly Game[],
): number => {
  const { roundOf, knockedOut } = roundsOf(places, games);
  return games.filter(
    (game) => !roundOf.has(game.Id) && !isPlayOff(game, roundOf, knockedOut),
  ).length;
};

// A place of the draw being worked out: who stands in it, or a bye, and the
// first-round places beneath it, in the order they are drawn.
interface Branch {
  readonly standing: number | "bye" | undefined;
  readonly places: readonly Listed[];
}

/**
 * The places of a knockout drawn as its games say rather than as its players
 * are listed (ImportKnockouts.feature), for one whose players were listed in
 * the order they were seeded: in the first round each player against whoever
 * they first played, and in each round after it each match's winner against
 * whoever they played next, the order listed deciding between pairs. A place
 * that played nobody in a round stands against a bye where there is one, and
 * otherwise against the next left, in the order listed.
 */
const drawnFromGames = (
  listed: readonly Listed[],
  games: readonly Game[],
): Listed[] => {
  const used = new Set<number>();
  let branches: Branch[] = listed.map((place) => ({
    standing: place.bye ? "bye" : place.player._Id,
    places: [place],
  }));
  while (branches.length > 1) {
    const left = [...branches];
    const paired: [Branch, Branch][] = [];
    const take = (branch: Branch): void => {
      left.splice(left.indexOf(branch), 1);
    };
    // Each against whoever they played next, in the order listed.
    for (const branch of branches) {
      if (!left.includes(branch)) continue;
      const one = branch.standing;
      if (typeof one !== "number") continue;
      // Their earliest game not yet given to a match, and whoever it was
      // against, where that player is still to be paired.
      const next = gamesInOrder(games).find(
        (game) =>
          !used.has(game.Id) &&
          (game.Winner.PlayerId === one || game.Loser.PlayerId === one),
      );
      const opponent =
        next === undefined
          ? undefined
          : next.Winner.PlayerId === one
            ? next.Loser.PlayerId
            : next.Winner.PlayerId;
      if (opponent === undefined) continue;
      const against = left.find(
        (other) => other !== branch && other.standing === opponent,
      );
      if (against === undefined) continue;
      take(branch);
      take(against);
      paired.push([branch, against]);
    }
    // Then whoever played nobody against a bye, and what is left as listed.
    for (const branch of [...left]) {
      if (!left.includes(branch) || branch.standing === "bye") continue;
      const bye = left.find((other) => other.standing === "bye");
      if (bye === undefined) continue;
      take(branch);
      take(bye);
      paired.push([branch, bye]);
    }
    while (left.length > 1) {
      const [one, other] = left;
      if (one === undefined || other === undefined) break;
      take(one);
      take(other);
      paired.push([one, other]);
    }
    branches = paired.map(([one, other]) => {
      const a = one.standing;
      const b = other.standing;
      let standing: number | "bye" | undefined;
      if (typeof a === "number" && typeof b === "number") {
        const played = games.filter(
          (game) => !used.has(game.Id) && isBetween(game, a, b),
        );
        for (const game of played) used.add(game.Id);
        const won = (number: number): number =>
          played.filter((game) => game.Winner.PlayerId === number).length;
        standing = won(a) > won(b) ? a : won(b) > won(a) ? b : undefined;
      } else {
        standing = a === "bye" ? b : b === "bye" ? a : undefined;
      }
      return { standing, places: [...one.places, ...other.places] };
    });
  }
  return [...(branches[0]?.places ?? listed)];
};

/**
 * The places of a knockout whose players fill it: as they are listed, or as
 * its games say they were drawn where that leaves fewer of its games with no
 * place in the draw (ImportKnockouts.feature).
 */
const placesOf = (
  listed: readonly Listed[],
  games: readonly Game[],
): Listed[] => {
  const asListed = misfitsOf(listed, games);
  if (asListed === 0) return [...listed];
  const drawn = drawnFromGames(listed, games);
  return misfitsOf(drawn, games) < asListed ? drawn : [...listed];
};

/**
 * Brings the old sites' knockouts over as knockouts, drawn as the old sites
 * drew them, byes and all, each round the best of what its games say
 * (ImportKnockouts.feature). One whose draw cannot be worked out is left
 * behind without an error, since nothing in it could be put right for the
 * import to bring over. Nothing is carried forward in a knockout.
 */
export class ImportKnockouts implements Importer<Knockout> {
  readonly collection = "Knockouts";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument(read: ReadDocument<Knockout>): Promise<void> {
    await importCompetition(this.importing, read, {
      carriesForward: false,
      shape: (document, listed): Shaped => {
        const size = document.Size;
        // Refused as the draw's shape is, before anything is worked out of a
        // draw that could never be.
        if (!isPowerOfTwo(size)) KnockoutDraw.from(size, []);
        const games = gamesInOrder(document.Games._Games);
        const places =
          listed.length === size
            ? placesOf(listed, games)
            : listed.length > size
              ? undefined
              : withByesWorkedOut(listed, games);
        if (places?.length !== size) return undefined;
        const { rounds, roundOf, knockedOut } = roundsOf(places, games);
        const draw = KnockoutDraw.from(size, rounds);
        return {
          entries: places,
          gamesInOrder: (toAdd) =>
            roundByRound(
              toAdd.filter((game) => !isPlayOff(game, roundOf, knockedOut)),
              roundOf,
            ),
          add: (tournament, id, name, by, at) => {
            tournament.addKnockout(id, name, draw, by, at);
          },
        };
      },
    });
  }
}
