import { TieBreak } from "../../../domain/aggregates/tournaments/value-objects/TieBreak.js";

/** What placing a player of a block asks of them. */
export interface PlayerToPlace {
  /** What the block's games name them by. */
  readonly id: string;
  readonly withdrawn: boolean;
  /** The matches they have won and lost, with what they carry forward. */
  readonly matchesWon: number;
  readonly matchesLost: number;
  readonly netGames: number;
  readonly netHoops: number;
}

/** A match somebody won, by the two players' ids. */
export interface DecidedMatch {
  readonly winner: string;
  readonly loser: string;
}

/** The place a player is given, and whether others have it too. */
export interface Placing {
  readonly place: number;
  readonly shared: boolean;
}

/** The players of a block placed. */
export interface PlacedPlayers {
  /**
   * The ids of the players in order, best first: those who cannot be told
   * apart in the block's order, and those who have withdrawn last.
   */
  readonly ranked: readonly string[];
  /** The place of each player who has one: not a player who has withdrawn. */
  readonly placings: ReadonlyMap<string, Placing>;
  /**
   * Whether any two players who have not withdrawn are level on the share of
   * their decided matches they have won, which is what a tie break is for.
   */
  readonly levelOnMatchesWon: boolean;
  /**
   * What told apart players level on the share, in the order it was looked at,
   * so that a page can say so without knowing the rules for itself: nothing
   * where the tie break tells nobody apart.
   */
  readonly tellsApartBy: readonly TellsApartBy[];
}

/** What a tie break can tell players level on the share apart by. */
export type TellsApartBy = "netGames" | "netHoops" | "whoBeatWho";

// The share of the matches a player has decided that they have won, and
// nothing where they have decided none.
const shareOf = ({ matchesWon, matchesLost }: PlayerToPlace): number =>
  matchesWon + matchesLost === 0 ? 0 : matchesWon / (matchesWon + matchesLost);

// `players` in runs of those with the same `key`, the greatest first. Each
// run keeps the order its players came in, since a sort that keeps the order
// of equals leaves them in the block's.
const runsByMost = (
  players: readonly PlayerToPlace[],
  key: (player: PlayerToPlace) => number,
): PlayerToPlace[][] => {
  const runs: PlayerToPlace[][] = [];
  for (const player of [...players].sort(
    (one, other) => key(other) - key(one),
  )) {
    const run = runs.at(-1);
    const [first] = run ?? [];
    if (
      run !== undefined &&
      first !== undefined &&
      key(first) === key(player)
    ) {
      run.push(player);
    } else {
      runs.push([player]);
    }
  }
  return runs;
};

// `players`, all level, told apart by who beat who among them and nobody else:
// each is given the matches they won against the others less the matches they
// lost to them. Those still level are told apart again among themselves, since
// a player's result against someone already placed above or below them says
// nothing of those who are not, and what cannot be told apart by it stays
// together: players who beat one another in a ring, who never met, or whose
// matches were shared. Only the games played in the block can say who beat
// whom, so what a player carries forward from play elsewhere says nothing here
// though it counts towards the matches they have won.
const byWhoBeatWho = (
  players: PlayerToPlace[],
  matches: readonly DecidedMatch[],
): PlayerToPlace[][] => {
  // Counted once for all of them, rather than by scanning every match for each
  // player.
  const net = new Map(players.map(({ id }) => [id, 0]));
  for (const { winner, loser } of matches) {
    const won = net.get(winner);
    const lost = net.get(loser);
    if (won === undefined || lost === undefined) continue;
    net.set(winner, won + 1);
    net.set(loser, lost - 1);
  }
  const runs = runsByMost(players, ({ id }) => net.get(id) ?? 0);
  return runs.length === 1
    ? runs
    : runs.flatMap((run) => byWhoBeatWho(run, matches));
};

interface Step {
  readonly by: TellsApartBy;
  readonly tell: (players: PlayerToPlace[]) => PlayerToPlace[][];
}

// What tells apart players level on the share, one step after another, each
// working on those the one before left level.
const stepsFor = (
  tieBreak: TieBreak,
  matches: readonly DecidedMatch[],
  bestOf: number,
): Step[] => {
  const whoBeatWho: Step = {
    by: "whoBeatWho",
    tell: (players) => byWhoBeatWho(players, matches),
  };
  const netHoops: Step = {
    by: "netHoops",
    tell: (players) => runsByMost(players, ({ netHoops: hoops }) => hoops),
  };
  if (tieBreak.equals(TieBreak.whoBeatWho)) return [whoBeatWho];
  if (tieBreak.equals(TieBreak.netGamesNetHoopsWhoBeatWho)) {
    // Where each match is a single game a game won is a match won, so net
    // games would only say again what the share has.
    const netGames: Step = {
      by: "netGames",
      tell: (players) => runsByMost(players, ({ netGames: games }) => games),
    };
    return bestOf === 1
      ? [netHoops, whoBeatWho]
      : [netGames, netHoops, whoBeatWho];
  }
  return [];
};

// Whether any play has been counted among the players who have not withdrawn:
// a match decided, or games and hoops, which carrying forward counts as well.
// Until then every player is level at nothing, and placing them all first
// would say a tie where there has been no play to tie.
const anyPlay = (
  players: readonly PlayerToPlace[],
  matches: readonly DecidedMatch[],
): boolean =>
  matches.length > 0 ||
  players.some(
    ({ withdrawn, matchesWon, matchesLost, netGames, netHoops }) =>
      !withdrawn &&
      (matchesWon + matchesLost > 0 || netGames !== 0 || netHoops !== 0),
  );

/**
 * `players`, in the block's order, placed. They are first placed by the share
 * of their decided matches that they have won, and those level on that are
 * told apart by `tieBreak`; those who cannot be told apart share a place, which
 * is the place of the first of them, and the player after them is placed after
 * the places they cover. A player who has withdrawn is placed after everybody
 * and has no place, since their games count for nothing. Where nothing has been
 * played yet nobody has a place, and nobody is level.
 *
 * `matches` are the matches somebody won, among `players`, and `bestOf` is
 * what each match is the best of.
 */
export const placePlayers = (
  players: readonly PlayerToPlace[],
  matches: readonly DecidedMatch[],
  tieBreak: TieBreak,
  bestOf: number,
): PlacedPlayers => {
  const steps = stepsFor(tieBreak, matches, bestOf);
  const tellsApartBy = steps.map(({ by }) => by);
  if (!anyPlay(players, matches)) {
    return {
      ranked: players.map(({ id }) => id),
      placings: new Map(),
      levelOnMatchesWon: false,
      tellsApartBy,
    };
  }
  const shareRuns = runsByMost(
    players.filter(({ withdrawn }) => !withdrawn),
    shareOf,
  );
  const runs = shareRuns.flatMap((run) =>
    steps.reduce<PlayerToPlace[][]>(
      (told, { tell }) => told.flatMap((level) => tell(level)),
      [run],
    ),
  );
  const placings = new Map<string, Placing>();
  let before = 0;
  for (const run of runs) {
    for (const { id } of run) {
      placings.set(id, { place: before + 1, shared: run.length > 1 });
    }
    before += run.length;
  }
  return {
    ranked: [
      ...runs.flat().map(({ id }) => id),
      ...players.filter(({ withdrawn }) => withdrawn).map(({ id }) => id),
    ],
    placings,
    levelOnMatchesWon: shareRuns.some((run) => run.length > 1),
    tellsApartBy,
  };
};
