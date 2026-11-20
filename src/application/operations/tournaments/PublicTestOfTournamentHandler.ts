import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import type { RequestType } from "../../common/Mediator.js";
import type { CompetitionGames, GameKept } from "./competitionGames.js";
import { NOBODY_IN_GAME, type PlayerInGame } from "./GamesOfTournament.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import type { WhichSide } from "./PublicKnockoutOfTournament.js";
import {
  type MatchOfTest,
  PublicTestOfTournament,
  type TestToRead,
} from "./PublicTestOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  competitionOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";
import { outcomeOfMatch } from "./outcomeOfMatch.js";
import { type TournamentAddresses } from "./tournamentOperations.js";

// The points of a score as it was typed, which are the digits it begins with.
const pointsOf = (typed: string): number => Score.kept(typed, false).points;

/**
 * A test's page, read of the read models alone: the tournament and the test's
 * rules and teams (`TournamentPages`) and its games and who played them
 * (`CompetitionGames`). Its matches are worked out here from the games, since
 * each depends on the games before it.
 */
export class PublicTestOfTournamentHandler extends QueryHandler<
  PublicTestOfTournament,
  TestToRead
> {
  readonly handles: RequestType<PublicTestOfTournament> =
    PublicTestOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly games: CompetitionGames,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicTestOfTournament): Promise<TestToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicTestOfTournament",
    );
    const test = await competitionOfPage(
      this.pages,
      tournament,
      query.slug,
      "test",
      {
        noSuchCompetition: "PublicTestOfTournament.NoSuchCompetition",
        notOfKind: "PublicTestOfTournament.NotATest",
        sentence: "The competition is not a test.",
      },
    );
    const gamesKept = await this.games.gamesKept(test.id);
    const games = gamesKept.games.filter((game) => !game.archived);
    // A test's teams and rules are kept with it, so one without is one the
    // read models were made before they were kept.
    if (test.teams === undefined || test.bestOf === undefined) {
      throw new Error(
        `The test ${test.id} has no teams or rules kept: the read models are to be made again.`,
      );
    }
    const first = test.teams.first;
    const bestOf = test.bestOf;

    // A team player is known by their team: its name stands for what they
    // represent and its flag is theirs.
    const shown = (player: string): PlayerInGame => {
      const who = gamesKept.who.get(player);
      return who === undefined
        ? NOBODY_IN_GAME
        : {
            playerId: who.playerId,
            name: who.name,
            representing: who.teamName,
            handicap: undefined,
            flag: who.teamFlag,
          };
    };
    // Players of either team, archived ones among them, since a game an
    // archived player played still counts for their team.
    const isFirst = (player: string): boolean =>
      gamesKept.who.get(player)?.team === first;
    // A team by its names, as they are now.
    const namesOf = async (
      team: string,
    ): Promise<{ name: string; shortName: string }> => {
      const found = await this.pages.team(team);
      return {
        name: found?.name ?? "",
        shortName: found?.shortName ?? "",
      };
    };

    const matches = matchesOf(
      games,
      isFirst,
      (player) => shown(player).name,
      (player) => shown(player).playerId,
      bestOf,
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
      const winnerFirst = isFirst(game.winner);
      const winners = winnerFirst ? tally.first : tally.second;
      const losers = winnerFirst ? tally.second : tally.first;
      winners.hoops += pointsOf(game.winnerScore);
      losers.hoops += pointsOf(game.loserScore);
      if (!game.drawn) winners.games += 1;
    }

    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address: tournament.address,
      playedByTeams: true,
      competitions: tournament.competitions,
      test: {
        teams: [
          { ...(await namesOf(first)), ...tally.first },
          { ...(await namesOf(test.teams.second)), ...tally.second },
        ],
        bestOf,
      },
      matches,
      games: games.map((game) => ({
        id: game.id,
        winner: shown(game.winner),
        winnerScore: game.winnerScore,
        loser: shown(game.loser),
        loserScore: game.loserScore,
        drawn: game.drawn,
        // When it was added, which a correction does not move, as the order
        // of play is told by it. A game kept before that was held is told by
        // when it last changed, as a block's games are.
        addedAt: game.addedAt ?? game.changedAt,
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
  games: readonly GameKept[],
  isFirst: (player: string) => boolean,
  nameOf: (player: string) => string,
  idOf: (player: string) => string,
  bestOf: number,
): MatchOfTest[] => {
  const byPair = new Map<
    string,
    { sides: [string, string]; games: GameKept[] }
  >();
  for (const game of games) {
    const players = [game.winner, game.loser];
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
    const { winner: matchWinner } = outcomeOfMatch(
      played,
      sides[0],
      sides[1],
      bestOf,
    );
    return {
      sides: [nameOf(sides[0]), nameOf(sides[1])],
      playerIds: [idOf(sides[0]), idOf(sides[1])],
      games: played.map((game) => {
        const winner = sideOf(game.winner);
        const scores = [game.winnerScore, game.loserScore];
        return {
          id: game.id,
          scores:
            winner === 0 ? [scores[0]!, scores[1]!] : [scores[1]!, scores[0]!],
          winner: game.drawn ? undefined : winner,
        };
      }),
      winner: matchWinner === undefined ? undefined : sideOf(matchWinner),
    };
  });
};
