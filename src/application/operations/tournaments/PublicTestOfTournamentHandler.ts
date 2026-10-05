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
import type { WhichSide } from "./PublicKnockoutOfTournament.js";
import {
  type MatchOfTest,
  PublicTestOfTournament,
  type TestToRead,
} from "./PublicTestOfTournament.js";
import {
  competitionsInUse,
  playersOf,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicTestOfTournamentHandler extends QueryHandler<
  PublicTestOfTournament,
  TestToRead
> {
  readonly handles: RequestType<PublicTestOfTournament> =
    PublicTestOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(query: PublicTestOfTournament): Promise<TestToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicTestOfTournament",
    );
    const found = tournament.competitions.find(
      ({ reference }) =>
        !reference.archived && reference.slug.toString() === query.slug,
    );
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "PublicTestOfTournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    const { reference, shape } = found;
    if (shape.kind !== "test") {
      throw new TournamentOperationRefused(
        "PublicTestOfTournament.NotATest",
        "The competition is not a test.",
      );
    }
    const competition = await competitionOf(this.competitions, reference.id);
    const games = competition.games.filter((game) => !game.archived);
    const first = shape.firstTeam.value;

    // The team each team player plays for, archived players among them, since
    // a game an archived player played still counts for their team.
    const teamOf = new Map<string, string>();
    for (const team of tournament.teams) {
      for (const player of team.players) {
        teamOf.set(player.id.value, team.id.value);
      }
    }
    const shown = playersOf(tournament);
    const nameless = { name: "" };
    const nameOf = (player: string): string =>
      (shown.get(player) ?? nameless).name;
    // A team by its names, as they are now.
    const namesOf = (team: string): { name: string; shortName: string } => {
      const found = tournament.teams.find((each) => each.id.value === team);
      return {
        name: found?.name.toString() ?? "",
        shortName: found?.shortName.toString() ?? "",
      };
    };

    const matches = matchesOf(
      games,
      (player) => teamOf.get(player) === first,
      nameOf,
      shape.bestOf.games,
    );
    // A match counts for the team whose player won it, once it is decided,
    // its first side always being the first team's.
    const won = (side: WhichSide): number =>
      matches.filter((match) => match.winner === side).length;
    const tally = {
      first: { matches: won(0), games: 0, hoops: 0 },
      second: { matches: won(1), games: 0, hoops: 0 },
    };
    for (const game of games) {
      const winnerFirst = teamOf.get(game.winner.value) === first;
      const winners = winnerFirst ? tally.first : tally.second;
      const losers = winnerFirst ? tally.second : tally.first;
      winners.hoops += game.winnerScore.points;
      losers.hoops += game.loserScore.points;
      if (!game.drawn) winners.games += 1;
    }

    return {
      name: tournament.name.toString(),
      address: tournament.address.toString(),
      playedByTeams: true,
      competitions: competitionsInUse(tournament),
      test: {
        teams: [
          { ...namesOf(first), ...tally.first },
          { ...namesOf(shape.secondTeam.value), ...tally.second },
        ],
        bestOf: shape.bestOf.games,
      },
      matches,
      games: games.map((game) => ({
        winner: shown.get(game.winner.value) ?? nameless,
        winnerScore: game.winnerScore.toString(),
        loser: shown.get(game.loser.value) ?? nameless,
        loserScore: game.loserScore.toString(),
        drawn: game.drawn,
        addedAt: game.addedAt,
      })),
    };
  }
}

// The matches among `games`, in the order the first game of each was added,
// each between the two players who play it, the first team's on the first
// side, as `isFirst` says. A match is decided once one side is beyond the
// other's reach or every game of it has been played, as the competition
// decides it before it refuses another game of it, and won by the side that
// has won more of it; level, it is shared, and won by neither.
const matchesOf = (
  games: readonly Game[],
  isFirst: (player: string) => boolean,
  nameOf: (player: string) => string,
  bestOf: number,
): MatchOfTest[] => {
  const byPair = new Map<string, { sides: [string, string]; games: Game[] }>();
  for (const game of games) {
    const players = [game.winner.value, game.loser.value];
    const [one = "", other = ""] = isFirst(players[0] ?? "")
      ? players
      : [players[1], players[0]];
    const pair = `${one} ${other}`;
    const match = byPair.get(pair) ?? { sides: [one, other], games: [] };
    match.games.push(game);
    byPair.set(pair, match);
  }
  return [...byPair.values()].map(({ sides, games: played }) => {
    const sideOf = (player: string): WhichSide => (player === sides[0] ? 0 : 1);
    const won = (side: WhichSide): number =>
      played.filter((game) => !game.drawn && sideOf(game.winner.value) === side)
        .length;
    const left = bestOf - played.length;
    const decided = left <= 0 || Math.abs(won(0) - won(1)) > left;
    return {
      sides: [nameOf(sides[0]), nameOf(sides[1])],
      games: played.map((game) => {
        const winner = sideOf(game.winner.value);
        const scores = [
          game.winnerScore.toString(),
          game.loserScore.toString(),
        ];
        return {
          scores:
            winner === 0 ? [scores[0]!, scores[1]!] : [scores[1]!, scores[0]!],
          winner: game.drawn ? undefined : winner,
        };
      }),
      winner:
        !decided || won(0) === won(1) ? undefined : won(0) > won(1) ? 0 : 1,
    };
  });
};
