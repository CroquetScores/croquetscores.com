import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type Competitions,
  competitionOf,
} from "../competitions/competitionOperations.js";
import {
  PublicTeamSummaryOfTournament,
  type TeamStanding,
  type TeamSummaryToRead,
} from "./PublicTeamSummaryOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

// What a team has to its name so far, added to a test at a time.
interface Tally {
  testsWon: number;
  testsLost: number;
  testsDrawn: number;
  gamesWon: number;
  gamesLost: number;
  hoopsFor: number;
  hoopsAgainst: number;
}

export class PublicTeamSummaryOfTournamentHandler extends QueryHandler<
  PublicTeamSummaryOfTournament,
  TeamSummaryToRead
> {
  readonly handles: RequestType<PublicTeamSummaryOfTournament> =
    PublicTeamSummaryOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(
    query: PublicTeamSummaryOfTournament,
  ): Promise<TeamSummaryToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicTeamSummaryOfTournament",
    );
    if (!tournament.format.isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicTeamSummaryOfTournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }

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
          gamesWon: 0,
          gamesLost: 0,
          hoopsFor: 0,
          hoopsAgainst: 0,
        },
      ]),
    );

    for (const { reference, shape } of tournament.competitions) {
      if (reference.archived || shape.kind !== "test") continue;
      const competition = await competitionOf(this.competitions, reference.id);
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
      // Not won, lost or drawn until every match it is expected to have is
      // decided, since until then its result is not known.
      if (matches.length < shape.expectedMatches.count) continue;
      const matchesWon = (team: string): number =>
        matches.filter(
          (winner) => winner !== undefined && teamOf.get(winner) === team,
        ).length;
      const firstSide = inTest.get(first)!;
      const secondSide = inTest.get(second)!;
      const margin =
        matchesWon(first) - matchesWon(second) ||
        (tournament.levelTestsDrawn
          ? 0
          : firstSide.net - secondSide.net ||
            firstSide.hoops - secondSide.hoops);
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
      name: tournament.name.toString(),
      address: tournament.address.toString(),
      playedByTeams: true,
      competitions: competitionsInUse(tournament),
      teams,
      ranked: rankingOf(teams).map(({ id }) => id),
    };
  }
}

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
// first, then the more net games, then the more net hoops, and otherwise as
// they were, since a sort that keeps the order of equals leaves them in the
// tournament's.
const rankingOf = (teams: readonly TeamStanding[]): TeamStanding[] =>
  [...teams].sort(
    (one, other) =>
      other.testsWon - one.testsWon ||
      other.gamesWon - other.gamesLost - (one.gamesWon - one.gamesLost) ||
      other.hoopsFor - other.hoopsAgainst - (one.hoopsFor - one.hoopsAgainst),
  );
