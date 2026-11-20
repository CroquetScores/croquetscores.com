import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import {
  type GameOfTournament,
  GamesOfTournament,
  NOBODY_IN_GAME,
  type PlayerInGame,
  type TournamentGames,
} from "./GamesOfTournament.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  formatOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A tournament's page, read of the read models alone: the tournament and who
 * plays in it (`TournamentPages`) and each competition's games
 * (`CompetitionGames`).
 */
export class GamesOfTournamentHandler extends QueryHandler<
  GamesOfTournament,
  TournamentGames
> {
  readonly handles: RequestType<GamesOfTournament> = GamesOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly games: CompetitionGames,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: GamesOfTournament): Promise<TournamentGames> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "GamesOfTournament",
    );
    const id = TournamentId.from(tournament.id);
    const people = await this.pages.peopleOf(tournament.id);
    const own = new Map(people.players.map((each) => [each.playerId, each]));

    const games: GameOfTournament[] = [];
    for (const competition of tournament.competitions) {
      const kept = await this.games.gamesKept(competition.id);
      // Only a block's and a Swiss's games are struck through for a player
      // who has withdrawn: a knockout's decide matches that stand. They are
      // the competitions with neither a draw, which is a knockout's, nor a
      // first team, which is a test's.
      const withdrawn = new Set(
        kept.draw === undefined && kept.firstTeam === undefined
          ? kept.entries.filter((each) => each.withdrawn).map((each) => each.id)
          : [],
      );
      // A game names its players by the id the competition gives them, or by
      // a team player's id in a test. A team player is known by their team: its
      // name stands for what they represent, and its flag is theirs.
      const playerFor = (written: string): PlayerInGame => {
        const who = kept.who.get(written);
        if (who === undefined) return NOBODY_IN_GAME;
        if (who.team !== undefined) {
          return {
            playerId: who.playerId,
            name: who.name,
            representing: who.teamName,
            handicap: undefined,
            flag: who.teamFlag,
          };
        }
        const player = own.get(who.playerId);
        return {
          playerId: who.playerId,
          name: player?.name ?? who.name,
          representing: player?.representing,
          handicap: player?.handicap,
          flag: player?.flag,
        };
      };
      for (const game of kept.games) {
        // A game kept before it was held when it was added has no place in a
        // list ordered by when games were added, so it is left out, as it
        // always has been.
        const { addedAt } = game;
        if (game.archived || addedAt === undefined) continue;
        games.push({
          winner: playerFor(game.winner),
          winnerScore: game.winnerScore,
          loser: playerFor(game.loser),
          loserScore: game.loserScore,
          drawn: game.drawn,
          withdrawn:
            game.withdrawn ||
            withdrawn.has(game.winner) ||
            withdrawn.has(game.loser),
          competition,
          addedAt,
        });
      }
    }
    // The most recently added first, and of games added at the same moment,
    // the one listed later first, so that the list reads back from now.
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      sport: tournament.sport,
      country: tournament.country,
      starts: tournament.starts,
      finishes: tournament.finishes,
      commentariesChanged: await this.changes.of(id),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address: tournament.address,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      competitions: tournament.competitions,
      games: games
        .reverse()
        .sort(
          (one, other) =>
            other.addedAt.toDate().getTime() - one.addedAt.toDate().getTime(),
        ),
    };
  }
}
