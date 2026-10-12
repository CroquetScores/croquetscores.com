import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type Competitions,
  competitionOf,
} from "../competitions/competitionOperations.js";
import { countsForNothingIn } from "../competitions/competitionGames.js";
import {
  type GameOfTournament,
  GamesOfTournament,
  type PlayerInGame,
  type TournamentGames,
} from "./GamesOfTournament.js";
import {
  competitionsInUse,
  playersOf,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";

export class GamesOfTournamentHandler extends QueryHandler<
  GamesOfTournament,
  TournamentGames
> {
  readonly handles: RequestType<GamesOfTournament> = GamesOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: GamesOfTournament): Promise<TournamentGames> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "GamesOfTournament",
    );
    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const competitions = competitionsInUse(tournament);
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
      const countsForNothing = countsForNothingIn(competition);
      for (const game of competition.games) {
        if (game.archived || game.addedAt === undefined) continue;
        games.push({
          winner: playerFor(competition, game.winner.value),
          winnerScore: String(game.winnerScore),
          loser: playerFor(competition, game.loser.value),
          loserScore: String(game.loserScore),
          drawn: game.drawn,
          withdrawn: countsForNothing(game),
          competition: competitions[at]!,
          addedAt: game.addedAt,
        });
      }
    }
    // The most recently added first, and of games added at the same moment,
    // the one listed later first, so that the list reads back from now.
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address: tournament.address.toString(),
      playedByTeams: tournament.format.isTeamFormat,
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
