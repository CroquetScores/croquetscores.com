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
 * time they showed one: the most games any match of the round had, made odd,
 * and never fewer than the round before. A round with no games is the best of
 * what the round before was, or of 1 where it is the first.
 *
 * A match's games are the games between its two players not already given to
 * a match, and its winner is whoever won more of them, or whoever met a bye.
 */
const roundsOf = (
  places: readonly Listed[],
  games: readonly Game[],
): number[] => {
  const used = new Set<number>();
  const rounds: number[] = [];
  let standing: (number | "bye" | undefined)[] = places.map((place) =>
    place.bye ? "bye" : place.player._Id,
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
        for (const game of played) used.add(game.Id);
        most = Math.max(most, played.length);
        const won = (number: number): number =>
          played.filter((game) => game.Winner.PlayerId === number).length;
        through.push(
          won(one) > won(other)
            ? one
            : won(other) > won(one)
              ? other
              : undefined,
        );
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
  return rounds;
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
            ? [...listed]
            : listed.length > size
              ? undefined
              : withByesWorkedOut(listed, games);
        if (places?.length !== size) return undefined;
        const draw = KnockoutDraw.from(size, roundsOf(places, games));
        return {
          entries: places,
          add: (tournament, id, name, by, at) => {
            tournament.addKnockout(id, name, draw, by, at);
          },
        };
      },
    });
  }
}
