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
  type GameOfPlayer,
  type Opponent,
  PublicPlayerOfTournament,
  type PlayerToRead,
} from "./PublicPlayerOfTournament.js";
import {
  type CompetitionOfTournament,
  competitionsInUse,
  tournamentForReaders,
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
    // Its players are its teams', who have their teams' pages.
    if (tournament.format.isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicPlayerOfTournament.PlayedByTeams",
        "The tournament is played by teams.",
      );
    }
    const player = tournament.players.find(
      (each) => !each.archived && each.slug.toString() === query.slug,
    );
    if (player === undefined) {
      throw new TournamentOperationRefused(
        "PublicPlayerOfTournament.NoSuchPlayer",
        "The tournament has no such player.",
      );
    }
    const address = tournament.address.toString();
    // Every player by their id, as an opponent is named and found.
    const opponents = new Map<string, Opponent>(
      tournament.players.map((each) => [
        each.id.value,
        {
          name: each.name.toString(),
          address: `${address}/players/${each.slug.toString()}`,
        },
      ]),
    );
    const competitions = competitionsInUse(tournament);
    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const games: GameOfPlayer[] = [];
    const entered: CompetitionOfTournament[] = [];
    for (const [at, { reference }] of inUse.entries()) {
      const competition = await competitionOf(this.competitions, reference.id);
      const theirs = competition.players.find((each) =>
        each.tournamentPlayerId.equals(player.id),
      );
      if (theirs === undefined) continue;
      const where = competitions[at]!;
      entered.push(where);
      // Each player in the competition by the id a game names them by.
      const opponentOf = (written: string): Opponent => {
        const found = competition.players.find(
          (each) => each.id.value === written,
        );
        return (
          opponents.get(found?.tournamentPlayerId.value ?? "") ?? {
            name: "",
            address,
          }
        );
      };
      for (const game of competition.games) {
        if (game.archived || game.addedAt === undefined) continue;
        const won = game.winner.equals(theirs.id);
        if (!won && !game.loser.equals(theirs.id)) continue;
        games.push({
          result: game.drawn ? "drawn" : won ? "won" : "lost",
          opponent: opponentOf(won ? game.loser.value : game.winner.value),
          score: String(won ? game.winnerScore : game.loserScore),
          opponentScore: String(won ? game.loserScore : game.winnerScore),
          competition: where,
          addedAt: game.addedAt,
        });
      }
    }
    return {
      name: tournament.name.toString(),
      address,
      competitions,
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
