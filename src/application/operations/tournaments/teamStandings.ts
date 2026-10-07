// How the teams of a tournament played by teams stand, counted from the
// tests asked about: every test in use for the tournament's summary
// (PublicTeamSummaryOfTournament.feature), a group's tests alone for a group's
// page (PublicGroupOfTournament.feature). One counting for both, so that a
// group's table and the summary can never come to count a test differently.
import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import {
  type Competitions,
  competitionOf,
} from "../competitions/competitionOperations.js";
import type { TeamStanding } from "./PublicTeamSummaryOfTournament.js";

/** A test of a tournament, as standingsOf is asked which to count. */
export type TestShape = Extract<
  Tournament["competitions"][number]["shape"],
  { readonly kind: "test" }
>;

/** How the teams stand in the tests counted. */
export interface Standings {
  /** Each team in use, in the tournament's order. */
  readonly teams: readonly TeamStanding[];
  /** Whether any test counted has matches the best of more than 1. */
  readonly bestOfMoreThanOne: boolean;
  /** The ids of the teams ranked, as rankingOf ranks them. */
  readonly ranked: readonly string[];
}

// What a team has to its name so far, added to a test at a time.
interface Tally {
  testsWon: number;
  testsLost: number;
  testsDrawn: number;
  matchesWon: number;
  matchesLost: number;
  gamesWon: number;
  gamesLost: number;
  hoopsFor: number;
  hoopsAgainst: number;
}

/**
 * How the teams of `tournament` stand, counting the tests in use that
 * `counts` says to, and no others.
 */
export const standingsOf = async (
  tournament: Tournament,
  competitions: Competitions,
  counts: (test: TestShape) => boolean,
): Promise<Standings> => {
  // The team each team player plays for, archived players among them, since
  // a game an archived player played still counts for their team.
  const teamOf = new Map<string, string>();
  for (const team of tournament.teams) {
    for (const player of team.players)
      teamOf.set(player.id.value, team.id.value);
  }
  const tallies = new Map<string, Tally>(
    tournament.teams.map((team) => [
      team.id.value,
      {
        testsWon: 0,
        testsLost: 0,
        testsDrawn: 0,
        matchesWon: 0,
        matchesLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        hoopsFor: 0,
        hoopsAgainst: 0,
      },
    ]),
  );

  for (const { reference, shape } of tournament.competitions) {
    if (reference.archived || shape.kind !== "test" || !counts(shape)) continue;
    const competition = await competitionOf(competitions, reference.id);
    const games = competition.games.filter((game) => !game.archived);
    const first = shape.firstTeam.value;
    const second = shape.secondTeam.value;
    // This test's games and hoops, each team's, for deciding it.
    const inTest = new Map<string, { net: number; hoops: number }>([
      [first, { net: 0, hoops: 0 }],
      [second, { net: 0, hoops: 0 }],
    ]);
    for (const game of games) {
      const winner = teamOf.get(game.winner.value);
      const loser = teamOf.get(game.loser.value);
      if (winner === undefined || loser === undefined) continue;
      const won = tallies.get(winner);
      const lost = tallies.get(loser);
      const winnerPoints = game.winnerScore.points;
      const loserPoints = game.loserScore.points;
      if (won !== undefined) {
        won.hoopsFor += winnerPoints;
        won.hoopsAgainst += loserPoints;
        if (!game.drawn) won.gamesWon += 1;
      }
      if (lost !== undefined) {
        lost.hoopsFor += loserPoints;
        lost.hoopsAgainst += winnerPoints;
        if (!game.drawn) lost.gamesLost += 1;
      }
      const winnersInTest = inTest.get(winner);
      const losersInTest = inTest.get(loser);
      if (winnersInTest !== undefined) {
        winnersInTest.hoops += winnerPoints - loserPoints;
        if (!game.drawn) winnersInTest.net += 1;
      }
      if (losersInTest !== undefined) {
        losersInTest.hoops -= winnerPoints - loserPoints;
        if (!game.drawn) losersInTest.net -= 1;
      }
    }

    const matches = matchesOf(games, shape.bestOf.games);
    // A match counts for its teams once it is decided, whether or not the
    // test is; a shared one for neither.
    for (const winner of matches) {
      if (winner === undefined) continue;
      const winners = teamOf.get(winner);
      const losers = winners === first ? second : first;
      const won = tallies.get(winners ?? "");
      const lost = tallies.get(losers);
      if (won !== undefined) won.matchesWon += 1;
      if (lost !== undefined) lost.matchesLost += 1;
    }
    const matchesWon = (team: string): number =>
      matches.filter(
        (winner) => winner !== undefined && teamOf.get(winner) === team,
      ).length;
    // Not won, lost or drawn until every match it is expected to have is
    // decided, since until then its result is not known; unless a team has
    // won more than half of them, which the other can no longer match.
    const expected = shape.expectedMatches.count;
    if (
      matches.length < expected &&
      Math.max(matchesWon(first), matchesWon(second)) * 2 <= expected
    ) {
      continue;
    }
    const firstSide = inTest.get(first)!;
    const secondSide = inTest.get(second)!;
    const margin =
      matchesWon(first) - matchesWon(second) ||
      (tournament.levelTestsDrawn
        ? 0
        : firstSide.net - secondSide.net || firstSide.hoops - secondSide.hoops);
    const firstTally = tallies.get(first);
    const secondTally = tallies.get(second);
    if (firstTally === undefined || secondTally === undefined) continue;
    if (margin > 0) {
      firstTally.testsWon += 1;
      secondTally.testsLost += 1;
    } else if (margin < 0) {
      secondTally.testsWon += 1;
      firstTally.testsLost += 1;
    } else {
      firstTally.testsDrawn += 1;
      secondTally.testsDrawn += 1;
    }
  }

  const teams = tournament.teams
    .filter(({ archived }) => !archived)
    .map((team): TeamStanding => ({
      id: team.id.value,
      name: team.name.toString(),
      shortName: team.shortName.toString(),
      ...tallies.get(team.id.value)!,
    }));
  return {
    teams,
    bestOfMoreThanOne: tournament.competitions.some(
      ({ reference, shape }) =>
        !reference.archived &&
        shape.kind === "test" &&
        counts(shape) &&
        shape.bestOf.games > 1,
    ),
    ranked: rankingOf(teams).map(({ id }) => id),
  };
};

// The matches decided among `games`, each answered with the team player who
// won it, or nothing where it was shared. Two players meet in one match, of
// `bestOf` games, decided once one of them is beyond the other's reach or
// every game of it has been played, as the competition decides it before it
// refuses another game of it; a drawn game is played but won by neither, so a
// match can end level, and is shared.
const matchesOf = (
  games: readonly Game[],
  bestOf: number,
): (string | undefined)[] => {
  const byPair = new Map<string, Game[]>();
  for (const game of games) {
    const pair = [game.winner.value, game.loser.value].sort().join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), game]);
  }
  const decided: (string | undefined)[] = [];
  for (const [pair, played] of byPair) {
    const [one = "", other = ""] = pair.split(" ");
    const won = (player: string): number =>
      played.filter((game) => !game.drawn && game.winner.value === player)
        .length;
    const left = bestOf - played.length;
    if (left > 0 && Math.abs(won(one) - won(other)) <= left) continue;
    decided.push(
      won(one) > won(other) ? one : won(other) > won(one) ? other : undefined,
    );
  }
  return decided;
};

// The teams ranked as the old site's summary ranked them: the more tests won
// first, then the more matches won, then the more net games, then the more net
// hoops, and otherwise as
// they were, since a sort that keeps the order of equals leaves them in the
// tournament's.
const rankingOf = (teams: readonly TeamStanding[]): TeamStanding[] =>
  [...teams].sort(
    (one, other) =>
      other.testsWon - one.testsWon ||
      other.matchesWon - one.matchesWon ||
      other.gamesWon - other.gamesLost - (one.gamesWon - one.gamesLost) ||
      other.hoopsFor - other.hoopsAgainst - (one.hoopsFor - one.hoopsAgainst),
  );
