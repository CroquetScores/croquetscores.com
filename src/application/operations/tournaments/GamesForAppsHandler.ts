import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { competitionFoundFor } from "./competitionForApps.js";
import {
  GamesForApps,
  type GameForApps,
  type GamesToTell,
} from "./GamesForApps.js";
import { PublicBlockOfTournament } from "./PublicBlockOfTournament.js";
import type { PublicBlockOfTournamentHandler } from "./PublicBlockOfTournamentHandler.js";
import { PublicKnockoutOfTournament } from "./PublicKnockoutOfTournament.js";
import type { PublicKnockoutOfTournamentHandler } from "./PublicKnockoutOfTournamentHandler.js";
import { PublicSwissOfTournament } from "./PublicSwissOfTournament.js";
import type { PublicSwissOfTournamentHandler } from "./PublicSwissOfTournamentHandler.js";
import { PublicTestOfTournament } from "./PublicTestOfTournament.js";
import type { PublicTestOfTournamentHandler } from "./PublicTestOfTournamentHandler.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/**
 * The games of a competition as the pages of the site show them, read of the
 * handlers of those pages so that the two cannot say different things of one
 * competition. A game's players are said by the id the tournament keeps them
 * by, which does not change, and not by the id the competition enters them by.
 */
export class GamesForAppsHandler extends QueryHandler<
  GamesForApps,
  GamesToTell
> {
  readonly handles: RequestType<GamesForApps> = GamesForApps;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly changes: Pick<
      TournamentsByWebsite,
      "changesOfTournament" | "changesOfGames"
    >,
    private readonly blocks: PublicBlockOfTournamentHandler,
    private readonly swisses: PublicSwissOfTournamentHandler,
    private readonly knockouts: PublicKnockoutOfTournamentHandler,
    private readonly tests: PublicTestOfTournamentHandler,
  ) {
    super();
  }

  async handle(query: GamesForApps): Promise<GamesToTell> {
    const { tournament, reference, shape, head } = await competitionFoundFor(
      this.tournaments,
      this.changes,
      query.website,
      query.tournament,
      query.competition,
      "GamesForApps",
    );
    const address = tournament.address.toString();
    const slug = reference.slug.toString();
    // A game with no change held has not been changed since the competition
    // was, which is no earlier than it truly was.
    const changes = await this.changes.changesOfGames(head.id);
    const changedAtOf = (game: string): ReadOnlyDate =>
      changes.get(game) ?? head.changedAt;

    switch (shape.kind) {
      case "block": {
        const read = await this.blocks.handle(
          new PublicBlockOfTournament(query.website, address, slug),
        );
        const who = new Map(read.players.map((player) => [player.id, player]));
        return {
          competition: head,
          games: read.games.map((game): GameForApps => {
            const winner = who.get(game.winner);
            const loser = who.get(game.loser);
            // A game the page shows is not left out of an answer.
            if (winner === undefined || loser === undefined) {
              throw new Error(`A game of ${head.id} names a player it lacks.`);
            }
            return {
              id: game.id,
              winner: {
                playerId: winner.playerId,
                name: winner.name,
                score: game.winnerScore,
              },
              loser: {
                playerId: loser.playerId,
                name: loser.name,
                score: game.loserScore,
              },
              drawn: game.drawn,
              withdrawn: game.withdrawn,
              round: undefined,
              changedAt: changedAtOf(game.id),
            };
          }),
        };
      }
      case "swiss": {
        const read = await this.swisses.handle(
          new PublicSwissOfTournament(query.website, address, slug),
        );
        return {
          competition: head,
          games: read.games.map((game): GameForApps => ({
            id: game.id,
            winner: {
              playerId: game.winner.playerId,
              name: game.winner.name,
              score: game.winnerScore,
            },
            loser: {
              playerId: game.loser.playerId,
              name: game.loser.name,
              score: game.loserScore,
            },
            drawn: game.drawn,
            withdrawn: game.withdrawn,
            round: undefined,
            changedAt: changedAtOf(game.id),
          })),
        };
      }
      case "knockout": {
        const read = await this.knockouts.handle(
          new PublicKnockoutOfTournament(query.website, address, slug),
        );
        return {
          competition: head,
          games: read.games.map((game): GameForApps => ({
            id: game.id,
            winner: {
              playerId: game.winner.playerId,
              name: game.winner.name,
              score: game.winnerScore,
            },
            loser: {
              playerId: game.loser.playerId,
              name: game.loser.name,
              score: game.loserScore,
            },
            drawn: game.drawn,
            // A knockout's game cannot be withdrawn.
            withdrawn: false,
            round: game.round,
            changedAt: changedAtOf(game.id),
          })),
        };
      }
      case "test": {
        const read = await this.tests.handle(
          new PublicTestOfTournament(query.website, address, slug),
        );
        return {
          competition: head,
          matches: read.matches.map((match) => {
            const [first, second] = match.playerIds;
            const [firstName, secondName] = match.sides;
            return {
              players: [
                { playerId: first, name: firstName },
                { playerId: second, name: secondName },
              ],
              games: match.games.map((game): GameForApps => {
                // A drawn game has no winner; the first side is then called
                // the winner, as the order they were typed in.
                const won = game.winner ?? 0;
                const sides = [
                  { playerId: first, name: firstName, score: game.scores[0] },
                  { playerId: second, name: secondName, score: game.scores[1] },
                ] as const;
                return {
                  id: game.id,
                  winner: sides[won],
                  loser: sides[won === 0 ? 1 : 0],
                  drawn: game.winner === undefined,
                  // A test's game cannot be withdrawn either.
                  withdrawn: false,
                  round: undefined,
                  changedAt: changedAtOf(game.id),
                };
              }),
            };
          }),
        };
      }
    }
  }
}
