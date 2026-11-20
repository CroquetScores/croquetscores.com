import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type GameOfPlayer,
  type Opponent,
  PublicPlayerOfTournament,
  type PlayerToRead,
} from "./PublicPlayerOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  formatOfPage,
  managerNotesChangedFor,
  playerPageOf,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A player's page, read of the read models alone: the tournament, its players
 * and its competitions (`TournamentPages`) and each competition's games
 * (`CompetitionGames`), so that it asks the events nothing.
 */
export class PublicPlayerOfTournamentHandler extends QueryHandler<
  PublicPlayerOfTournament,
  PlayerToRead
> {
  readonly handles: RequestType<PublicPlayerOfTournament> =
    PublicPlayerOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly games: CompetitionGames,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicPlayerOfTournament): Promise<PlayerToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicPlayerOfTournament",
    );
    const { address } = tournament;
    const pageOf = (slug: string | undefined): string =>
      playerPageOf(address, slug);
    const people = await this.pages.peopleOf(tournament.id);
    // The player, whether the tournament's own or one of a team's, and the
    // team they play for where they are a team's: a player of an archived
    // team is no more one a reader is sent to than an archived player is.
    const own = people.players.find(
      (each) => !each.archived && each.slug === query.slug,
    );
    const team = people.teams.find(
      (each) =>
        !each.archived &&
        each.players.some(
          (player) => !player.archived && player.slug === query.slug,
        ),
    );
    const player =
      own ??
      team?.players.find((each) => !each.archived && each.slug === query.slug);
    if (player === undefined) {
      throw new TournamentOperationRefused(
        "PublicPlayerOfTournament.NoSuchPlayer",
        "The tournament has no such player.",
      );
    }
    // Every player by their id, as an opponent is named and found: the
    // tournament's own, and every team's, since a game in a test names its
    // players by their own ids.
    const opponents = new Map<string, Opponent>([
      ...people.players.map(
        (each) =>
          [
            each.playerId,
            { name: each.name, address: pageOf(each.slug) },
          ] as const,
      ),
      ...people.teams.flatMap((each) =>
        each.players.map(
          (other) =>
            [
              other.playerId,
              {
                name: other.name,
                address: pageOf(other.slug),
                team: each.shortName,
              },
            ] as const,
        ),
      ),
    ]);
    const nobody: Opponent = { name: "", address };
    const games: GameOfPlayer[] = [];
    const entered: (typeof tournament.competitions)[number][] = [];
    for (const shape of await this.pages.competitionsInUse(tournament.id)) {
      // A team's players are not entered in a test one by one but play in it
      // for their team, and its games name them by their own ids; anybody
      // else is entered in a competition, and its games name its entries.
      const playing =
        shape.kind === "test"
          ? team !== undefined &&
            (shape.firstTeam === team.id || shape.secondTeam === team.id)
          : own !== undefined;
      if (!playing) continue;
      const where = tournament.competitions.find(({ id }) => id === shape.id);
      if (where === undefined) continue;
      const kept = await this.games.gamesKept(shape.id);
      let theirs = player.playerId;
      let opponentOf = (written: string): Opponent =>
        opponents.get(written) ?? nobody;
      if (shape.kind !== "test") {
        const entry = kept.entries.find(
          (each) => each.tournamentPlayerId === player.playerId,
        );
        if (entry === undefined) continue;
        theirs = entry.id;
        // Each player in the competition by the id a game names them by.
        opponentOf = (written: string): Opponent => {
          const found = kept.entries.find((each) => each.id === written);
          return opponents.get(found?.tournamentPlayerId ?? "") ?? nobody;
        };
      }
      // Only in a block or a Swiss does a player's withdrawing take their
      // games with it: in a knockout each decided a match that stands.
      const withdrawn = new Set(
        shape.kind === "block" || shape.kind === "swiss"
          ? kept.entries.filter((each) => each.withdrawn).map(({ id }) => id)
          : [],
      );
      entered.push(where);
      for (const game of kept.games) {
        // Listed by when it was added, which a game kept before that was said
        // has not got, so by when it last changed until the read models are
        // made again.
        const addedAt = game.addedAt ?? game.changedAt;
        if (game.archived || addedAt === undefined) continue;
        const won = game.winner === theirs;
        if (!won && game.loser !== theirs) continue;
        games.push({
          result: game.drawn ? "drawn" : won ? "won" : "lost",
          opponent: opponentOf(won ? game.loser : game.winner),
          score: won ? game.winnerScore : game.loserScore,
          opponentScore: won ? game.loserScore : game.winnerScore,
          withdrawn:
            game.withdrawn ||
            withdrawn.has(game.winner) ||
            withdrawn.has(game.loser),
          competition: where,
          addedAt,
        });
      }
    }
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address,
      competitions: tournament.competitions,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      player: { name: player.name },
      // The most recently added first, and of games added at the same moment,
      // the one listed later first, so that the list reads back from now.
      games: games
        .reverse()
        .sort(
          (one, other) =>
            other.addedAt.toDate().getTime() - one.addedAt.toDate().getTime(),
        ),
      entered: entered.reverse(),
    };
  }
}
