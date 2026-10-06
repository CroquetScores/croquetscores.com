import type { CarryForwardCount } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type Competitions,
  competitionOf,
} from "../competitions/competitionOperations.js";
import type { PlayerInGame } from "./GamesOfTournament.js";
import {
  type PlayerOfSwiss,
  PublicSwissOfTournament,
  type ResultOfSwiss,
  type SwissToRead,
} from "./PublicSwissOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicSwissOfTournamentHandler extends QueryHandler<
  PublicSwissOfTournament,
  SwissToRead
> {
  readonly handles: RequestType<PublicSwissOfTournament> =
    PublicSwissOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicSwissOfTournament): Promise<SwissToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicSwissOfTournament",
    );
    const found = tournament.competitions.find(
      ({ reference }) =>
        !reference.archived && reference.slug.toString() === query.slug,
    );
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "PublicSwissOfTournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    const { reference, shape } = found;
    if (shape.kind !== "swiss") {
      throw new TournamentOperationRefused(
        "PublicSwissOfTournament.NotASwiss",
        "The competition is not a Swiss.",
      );
    }
    const competition = await competitionOf(this.competitions, reference.id);
    const games = competition.games.filter((game) => !game.archived);
    const address = tournament.address.toString();

    // Each player of the Swiss as its pages name them, by the id its games
    // name them by.
    const named = new Map<string, PlayerInGame & { address: string }>();
    for (const entered of competition.players) {
      const player = tournament.players.find((each) =>
        each.id.equals(entered.tournamentPlayerId),
      );
      if (player === undefined) continue;
      named.set(entered.id.value, {
        name: player.name.toString(),
        representing: player.representing,
        flag: player.flag === undefined ? undefined : String(player.flag),
        address: `${address}/players/${player.slug.toString()}`,
      });
    }
    const nameless = { name: "", address };

    const players = competition.players.flatMap((entered): PlayerOfSwiss[] => {
      const player = named.get(entered.id.value);
      if (player === undefined) return [];
      // What is not carried forward counts as nothing carried.
      const carried = (count: CarryForwardCount): number =>
        entered.carryForward.of(count) ?? 0;
      const results = games.flatMap((game): ResultOfSwiss[] => {
        const won = game.winner.equals(entered.id);
        if (!won && !game.loser.equals(entered.id)) return [];
        const theirs = won ? game.winnerScore : game.loserScore;
        const against = won ? game.loserScore : game.winnerScore;
        const opponent =
          named.get(won ? game.loser.value : game.winner.value) ?? nameless;
        return [
          {
            opponent: { name: opponent.name, address: opponent.address },
            result: game.drawn ? "drawn" : won ? "won" : "lost",
            margin: theirs.points - against.points,
          },
        ];
      });
      return [
        {
          ...player,
          id: entered.id.value,
          withdrawn: entered.withdrawn,
          gamesPlayed:
            results.length + carried("gameWins") + carried("gameLosses"),
          gamesWon:
            results.filter(({ result }) => result === "won").length +
            carried("gameWins"),
          netHoops:
            results.reduce((net, { margin }) => net + margin, 0) +
            carried("hoopsFor") -
            carried("hoopsAgainst"),
          results,
        },
      ];
    });

    return {
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      competitions: competitionsInUse(tournament),
      swiss: { name: reference.name.toString() },
      players,
      ranked: rankingOf(players).map(({ id }) => id),
      games: games.map((game) => ({
        winner: named.get(game.winner.value) ?? nameless,
        winnerScore: game.winnerScore.toString(),
        loser: named.get(game.loser.value) ?? nameless,
        loserScore: game.loserScore.toString(),
        drawn: game.drawn,
        addedAt: game.addedAt,
      })),
    };
  }
}

// `players` ranked as the old site ranked a Swiss: the greater share of their
// games won first, then the more net hoops, and otherwise as they were, since
// a sort that keeps the order of equals leaves them in the Swiss's. A player
// who has played no game has no share, and comes after every player who has,
// since nothing yet says where they stand.
const rankingOf = (players: readonly PlayerOfSwiss[]): PlayerOfSwiss[] => {
  const shareOf = ({ gamesWon, gamesPlayed }: PlayerOfSwiss): number =>
    gamesWon / gamesPlayed;
  const played = players.filter(({ gamesPlayed }) => gamesPlayed > 0);
  const unplayed = players.filter(({ gamesPlayed }) => gamesPlayed === 0);
  return [
    ...[...played].sort(
      (one, other) =>
        shareOf(other) - shareOf(one) || other.netHoops - one.netHoops,
    ),
    ...unplayed,
  ];
};
