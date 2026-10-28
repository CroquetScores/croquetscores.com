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
  toldOf,
} from "../competitions/competitionOperations.js";
import {
  type CompetitionOfRanking,
  PublicRankingsOfTournament,
  type RankingsToRead,
  type ResultOfRanking,
} from "./PublicRankingsOfTournament.js";
import { tournamentForReaders } from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";

// A handicap needs the space before it, so that a number joined to the last
// word, as in "Joe Blow2", stays part of the name. Several are taken off, as
// one written twice is still no part of who somebody is.
const TRAILING_HANDICAP = /(?:\s+[+-]?\d{1,2}(?:\.\d)?)+\s*$/;

// The name given is kept as it was: whoever gave it chose it, and may have
// meant a number at its end. Where none was given the player's name is used
// less a handicap typed after it, and a name that is nothing but a handicap
// is left as it is, as it would have nothing left to go by.
const knownToWorldRankingsAs = (player: {
  readonly name: { toString(): string };
  readonly worldRankingName: { toString(): string } | undefined;
}): string => {
  if (player.worldRankingName !== undefined)
    return player.worldRankingName.toString();
  const name = player.name.toString();
  const without = name.replace(TRAILING_HANDICAP, "").trim();
  return without === "" ? name : without;
};

export class PublicRankingsOfTournamentHandler extends QueryHandler<
  PublicRankingsOfTournament,
  RankingsToRead
> {
  readonly handles: RequestType<PublicRankingsOfTournament> =
    PublicRankingsOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(query: PublicRankingsOfTournament): Promise<RankingsToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicRankingsOfTournament",
    );
    const answered = {
      name: tournament.name.toString(),
      address: tournament.address.toString(),
      sport: tournament.sport.code,
      country: tournament.country.name,
      playedByTeams: tournament.format.isTeamFormat,
      starts: tournament.starts.toISOString().slice(0, 10),
      finishes: tournament.finishes.toISOString().slice(0, 10),
    };
    // A competition counts or not for itself, so a tournament has rankings
    // where its sport does and, unless it has none yet, some competition in use
    // counts.
    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const counted = inUse.filter(({ rules }) => rules.worldRankings);
    if (!tournament.sport.countsTowardsWorldRankings) {
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

    // Each player by the name the world rankings know them by, which is their
    // name where none was given, under the id a game names them by: a
    // tournament player's, and a team player's in a test.
    const known = new Map<string, string>([
      ...tournament.players.map(
        (player) => [player.id.value, knownToWorldRankingsAs(player)] as const,
      ),
      ...tournament.teams.flatMap((team) =>
        team.players.map(
          (player) =>
            [player.id.value, knownToWorldRankingsAs(player)] as const,
        ),
      ),
    ]);

    const competitions: CompetitionOfRanking[] = [];
    for (const { reference, shape, rules } of tournament.competitions) {
      if (reference.archived || !rules.worldRankings) continue;
      const competition = await competitionOf(this.competitions, reference.id);
      // A competition's player by their name, through the tournament player
      // they were entered as.
      const nameOf = (written: string): string => {
        const entered = competition.players.find(
          (player) => player.id.value === written,
        );
        return known.get(entered?.tournamentPlayerId.value ?? written) ?? "";
      };
      // A game of a block, a Swiss or a test, or one a knockout has no match
      // for, is a result of one game.
      const gameAsResult = (game: Game): ResultOfRanking => ({
        winner: nameOf(game.winner.value),
        loser: nameOf(game.loser.value),
        games: [
          {
            winnerScore: game.winnerScore.toString(),
            loserScore: game.loserScore.toString(),
            wonByWinner: true,
          },
        ],
      });
      const results: ResultOfRanking[] = [];
      if (shape.kind === "knockout") {
        const matches = competition.knockoutMatches(
          toldOf(tournament, reference.id),
        );
        for (const match of matches) {
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
            games: match.games.map((game) =>
              game.winner.equals(winner.player.id)
                ? {
                    winnerScore: game.winnerScore.toString(),
                    loserScore: game.loserScore.toString(),
                    wonByWinner: true,
                  }
                : {
                    winnerScore: game.loserScore.toString(),
                    loserScore: game.winnerScore.toString(),
                    wonByWinner: false,
                  },
            ),
          });
        }
      } else {
        for (const game of competition.games) {
          if (!game.archived) results.push(gameAsResult(game));
        }
      }
      if (results.length > 0) {
        competitions.push({ name: reference.name.toString(), results });
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
