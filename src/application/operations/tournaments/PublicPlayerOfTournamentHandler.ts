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
  countsForNothingIn,
} from "../competitions/competitionOperations.js";
import {
  type GameOfPlayer,
  type Opponent,
  PublicPlayerOfTournament,
  type PlayerToRead,
} from "./PublicPlayerOfTournament.js";
import {
  type CompetitionOfTournament,
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicPlayerOfTournamentHandler extends QueryHandler<
  PublicPlayerOfTournament,
  PlayerToRead
> {
  readonly handles: RequestType<PublicPlayerOfTournament> =
    PublicPlayerOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicPlayerOfTournament): Promise<PlayerToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicPlayerOfTournament",
    );
    const address = tournament.address.toString();
    const pageOf = (slug: { toString(): string }): string =>
      `${address}/players/${slug.toString()}`;
    // The player, whether the tournament's own or one of a team's, and the
    // team they play for where they are a team's: a player of an archived
    // team is no more one a reader is sent to than an archived player is.
    const own = tournament.players.find(
      (each) => !each.archived && each.slug.toString() === query.slug,
    );
    const team = tournament.teams.find(
      (each) =>
        !each.archived &&
        each.players.some(
          (player) => !player.archived && player.slug.toString() === query.slug,
        ),
    );
    const player =
      own ??
      team?.players.find(
        (each) => !each.archived && each.slug.toString() === query.slug,
      );
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
      ...tournament.players.map(
        (each) =>
          [
            each.id.value,
            { name: each.name.toString(), address: pageOf(each.slug) },
          ] as const,
      ),
      ...tournament.teams.flatMap((each) =>
        each.players.map(
          (other) =>
            [
              other.id.value,
              {
                name: other.name.toString(),
                address: pageOf(other.slug),
                team: each.shortName.toString(),
              },
            ] as const,
        ),
      ),
    ]);
    const nobody: Opponent = { name: "", address };
    const competitions = competitionsInUse(tournament);
    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const games: GameOfPlayer[] = [];
    const entered: CompetitionOfTournament[] = [];
    for (const [at, { reference, shape }] of inUse.entries()) {
      // A team's players are not entered in a test one by one but play in it
      // for their team, and its games name them by their own ids; anybody
      // else is entered in a competition, and its games name its entries.
      const playing =
        shape.kind === "test"
          ? team !== undefined &&
            (shape.firstTeam.equals(team.id) ||
              shape.secondTeam.equals(team.id))
          : own !== undefined;
      if (!playing) continue;
      const competition = await competitionOf(this.competitions, reference.id);
      let theirs = player.id.value;
      let opponentOf = (written: string): Opponent =>
        opponents.get(written) ?? nobody;
      if (shape.kind !== "test") {
        const entry = competition.players.find((each) =>
          each.tournamentPlayerId.equals(player.id),
        );
        if (entry === undefined) continue;
        theirs = entry.id.value;
        // Each player in the competition by the id a game names them by.
        opponentOf = (written: string): Opponent => {
          const found = competition.players.find(
            (each) => each.id.value === written,
          );
          return opponents.get(found?.tournamentPlayerId.value ?? "") ?? nobody;
        };
      }
      const countsForNothing = countsForNothingIn(
        competition,
        tournament,
        reference.id,
      );
      const where = competitions[at]!;
      entered.push(where);
      for (const game of competition.games) {
        if (game.archived || game.addedAt === undefined) continue;
        const won = game.winner.value === theirs;
        if (!won && game.loser.value !== theirs) continue;
        games.push({
          result: game.drawn ? "drawn" : won ? "won" : "lost",
          opponent: opponentOf(won ? game.loser.value : game.winner.value),
          score: String(won ? game.winnerScore : game.loserScore),
          opponentScore: String(won ? game.loserScore : game.winnerScore),
          withdrawn: countsForNothing(game),
          competition: where,
          addedAt: game.addedAt,
        });
      }
    }
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      competitions,
      playedByTeams: tournament.format.isTeamFormat,
      player: { name: player.name.toString() },
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
