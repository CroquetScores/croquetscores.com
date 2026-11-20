import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import {
  dayInTimeZone,
  timeZoneOf,
} from "../../../domain/aggregates/tournaments/value-objects/timeZones.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames, GameKept } from "./competitionGames.js";
import type { CompetitionStandings } from "./competitionStandings.js";
import { matchesOfKept } from "./knockoutPlayOfKept.js";
import {
  type CompetitionOfRanking,
  PublicRankingsOfTournament,
  type RankingsToRead,
  type ResultOfRanking,
} from "./PublicRankingsOfTournament.js";
import { formatOfPage, tournamentOfPage } from "./tournamentOfPage.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";
import type { TournamentRankings } from "./tournamentRankings.js";

/**
 * The rankings of a tournament, read of the read models alone: the tournament
 * and what it is made of (`TournamentPages`, `TournamentRankings`), its games
 * (`CompetitionGames`) and a block's winner, which is its kept standings
 * (`CompetitionStandings`), so that the file and the block's page cannot say
 * two different things.
 */
export class PublicRankingsOfTournamentHandler extends QueryHandler<
  PublicRankingsOfTournament,
  RankingsToRead
> {
  readonly handles: RequestType<PublicRankingsOfTournament> =
    PublicRankingsOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly rankings: TournamentRankings,
    private readonly games: CompetitionGames,
    private readonly standings: CompetitionStandings,
  ) {
    super();
  }

  async handle(query: PublicRankingsOfTournament): Promise<RankingsToRead> {
    const page = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicRankingsOfTournament",
    );
    const tournament = await this.rankings.tournament(page.id);
    if (tournament === undefined) {
      // The page found it, so a gap here is the read models not being whole.
      throw new Error(
        `The tournament ${page.id} has no rankings kept: the read models are to be made again.`,
      );
    }
    const country = Countries.thereAre.find(tournament.country);
    const answered = {
      name: page.name,
      address: page.address,
      sport: page.sport,
      country: country?.name ?? tournament.country,
      playedByTeams: formatOfPage(page).isTeamFormat,
      starts: tournament.starts,
      finishes: tournament.finishes,
    };
    // A competition counts or not for itself, so a tournament has rankings
    // where its sport does and, unless it has none yet, some competition in use
    // counts.
    const inUse = tournament.competitions;
    const counted = inUse.filter(({ worldRankings }) => worldRankings);
    if (!Sport.from(page.sport).countsTowardsWorldRankings) {
      return {
        ...answered,
        rankings: { is: "not available", because: "sport" },
      };
    }
    if (inUse.length > 0 && counted.length === 0) {
      return {
        ...answered,
        rankings: { is: "not available", because: "notCounted" },
      };
    }

    // The day a game was added is the day where the tournament is played, since
    // that is the day those entering its results kept it by. A game kept before
    // its first day was held falls back to when it last changed, and one with
    // no time of its own to when its competition did, which is never earlier
    // than it truly was.
    const timeZone = timeZoneOf(tournament.country, tournament.region);
    const dayOf = (
      game: GameKept,
      competitionChangedAt: ReadOnlyDate,
    ): { day: string } => ({
      day: dayInTimeZone(
        (game.addedAt ?? game.changedAt ?? competitionChangedAt).toDate(),
        timeZone,
      ),
    });

    const competitions: CompetitionOfRanking[] = [];
    for (const { id, name, kind, worldRankings, changedAt } of inUse) {
      if (!worldRankings) continue;
      const kept = await this.games.gamesKept(id);
      // A competition's player by their name, through the tournament player
      // they were entered as; a test names its players by their ids in their
      // teams, which are known as they are.
      const entered = new Map(
        kept.entries.map((entry) => [entry.id, entry.tournamentPlayerId]),
      );
      const nameOf = (written: string): string =>
        tournament.names.get(entered.get(written) ?? written) ?? "";
      // A game of a block, a Swiss or a test, or one a knockout has no match
      // for, is a result of one game.
      const gameAsResult = (game: GameKept): ResultOfRanking => ({
        winner: nameOf(game.winner),
        loser: nameOf(game.loser),
        games: [
          {
            winnerScore: game.winnerScore,
            loserScore: game.loserScore,
            wonByWinner: true,
            ...dayOf(game, changedAt),
          },
        ],
      });
      const results: ResultOfRanking[] = [];
      if (kind === "knockout") {
        const keptGame = new Map(kept.games.map((game) => [game.id, game]));
        for (const match of matchesOfKept(kept)) {
          const [one, other] = match.sides;
          if (
            match.games.length === 0 ||
            one.is !== "player" ||
            other.is !== "player"
          ) {
            continue;
          }
          // The match's winner where it is decided, and otherwise whoever
          // has won more of what has been played, the first game's winner
          // where they are level.
          const won = (id: string): number =>
            match.games.filter((game) => game.winner.value === id).length;
          const oneWon = won(one.player.id.value);
          const otherWon = won(other.player.id.value);
          const first = match.games[0]!;
          const oneWins =
            match.winner.is === "player"
              ? match.winner.player.id.equals(one.player.id)
              : oneWon === otherWon
                ? first.winner.equals(one.player.id)
                : oneWon > otherWon;
          const [winner, loser] = oneWins ? [one, other] : [other, one];
          results.push({
            winner: nameOf(winner.player.id.value),
            loser: nameOf(loser.player.id.value),
            games: match.games.map((played) => {
              // The domain's game knows who played it and not the score, which
              // is the kept one's, found by its id.
              const game = keptGame.get(played.id.value)!;
              return played.winner.equals(winner.player.id)
                ? {
                    winnerScore: game.winnerScore,
                    loserScore: game.loserScore,
                    wonByWinner: true,
                    ...dayOf(game, changedAt),
                  }
                : {
                    winnerScore: game.loserScore,
                    loserScore: game.winnerScore,
                    wonByWinner: false,
                    ...dayOf(game, changedAt),
                  };
            }),
          });
        }
      } else {
        for (const game of kept.games) {
          if (!game.archived) results.push(gameAsResult(game));
        }
      }
      if (results.length > 0) {
        // The player a block places first where only one is, and nobody where
        // players cannot be told apart for first, as the block's page does,
        // which reads the same standings.
        // A player whose tournament player is not known is left out, as the
        // block's page leaves it out, so the two name the same winner.
        const [first] =
          kind === "block"
            ? (await this.standings.standingsKept(id)).standings.filter(
                (each) => tournament.names.has(each.tournamentPlayerId),
              )
            : [];
        competitions.push({
          name,
          results,
          winner:
            kind === "block"
              ? first?.place === 1 && !first.shared
                ? nameOf(first.entryId)
                : ""
              : undefined,
        });
      }
    }
    return {
      ...answered,
      rankings: {
        is: "available",
        competitions,
        competitionCount: counted.length,
      },
    };
  }
}
