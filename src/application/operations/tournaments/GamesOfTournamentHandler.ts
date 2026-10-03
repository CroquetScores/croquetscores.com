import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type Competitions,
  competitionOf,
} from "../competitions/competitionOperations.js";
import {
  type CompetitionOfTournament,
  type GameOfTournament,
  GamesOfTournament,
  type PlayerInGame,
  type TournamentGames,
} from "./GamesOfTournament.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

const noSuchTournament = (): never => {
  throw new TournamentOperationRefused(
    "GamesOfTournament.NoSuchTournament",
    "There is no such tournament.",
  );
};

// Each of the tournament's players by their id, as a game names them: a
// player entered in a competition by what the tournament calls them now, what
// they represent and the flag they fly; and a player of a team, in a test,
// by their name, representing their team and flying its flag, since a team's
// players are known by their team.
const playersOf = (tournament: Tournament): Map<string, PlayerInGame> =>
  new Map([
    ...tournament.players.map(
      (player) =>
        [
          player.id.value,
          {
            name: player.name.toString(),
            representing: player.representing,
            flag: player.flag === undefined ? undefined : String(player.flag),
          },
        ] as const,
    ),
    ...tournament.teams.flatMap((team) =>
      team.players.map(
        (player) =>
          [
            player.id.value,
            {
              name: player.name.toString(),
              representing: team.name.toString(),
              flag: team.flag === undefined ? undefined : String(team.flag),
            },
          ] as const,
      ),
    ),
  ]);

export class GamesOfTournamentHandler extends QueryHandler<
  GamesOfTournament,
  TournamentGames
> {
  readonly handles: RequestType<GamesOfTournament> = GamesOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(query: GamesOfTournament): Promise<TournamentGames> {
    const website = Website.from(query.website);
    const id = await this.addresses.tournamentAt(query.address);
    const tournament =
      id === undefined ? undefined : await this.tournaments.load(id);
    // An address is a website's own, so one of another website's tournaments
    // is no tournament of this one.
    if (
      tournament === undefined ||
      !tournament.website.equals(website) ||
      tournament.archived
    ) {
      return noSuchTournament();
    }
    const address = tournament.address.toString();
    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const competitions: CompetitionOfTournament[] = inUse.map(
      ({ reference, shape }) => ({
        name: reference.name.toString(),
        address: `${address}/${shape.kind === "test" ? "tests" : "competitions"}/${reference.slug.toString()}`,
      }),
    );
    const players = playersOf(tournament);
    const playerFor = (
      competition: Awaited<ReturnType<typeof competitionOf>>,
      written: string,
    ): PlayerInGame => {
      const entered = competition.players.find(
        (player) => player.id.value === written,
      );
      return (
        players.get(entered?.tournamentPlayerId.value ?? written) ?? {
          name: "",
        }
      );
    };
    const games: GameOfTournament[] = [];
    for (const [at, { reference }] of inUse.entries()) {
      const competition = await competitionOf(this.competitions, reference.id);
      for (const game of competition.games) {
        if (game.archived || game.addedAt === undefined) continue;
        games.push({
          winner: playerFor(competition, game.winner.value),
          winnerScore: String(game.winnerScore),
          loser: playerFor(competition, game.loser.value),
          loserScore: String(game.loserScore),
          drawn: game.drawn,
          competition: competitions[at]!,
          addedAt: game.addedAt,
        });
      }
    }
    // The most recently added first, and of games added at the same moment,
    // the one listed later first, so that the list reads back from now.
    return {
      name: tournament.name.toString(),
      address,
      competitions,
      games: games
        .reverse()
        .sort(
          (one, other) =>
            other.addedAt.toDate().getTime() - one.addedAt.toDate().getTime(),
        ),
    };
  }
}
