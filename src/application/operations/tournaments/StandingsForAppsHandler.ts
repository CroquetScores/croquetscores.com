import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { competitionFoundFor } from "./competitionForApps.js";
import { PublicBlockOfTournament } from "./PublicBlockOfTournament.js";
import type { PublicBlockOfTournamentHandler } from "./PublicBlockOfTournamentHandler.js";
import { PublicSwissOfTournament } from "./PublicSwissOfTournament.js";
import type { PublicSwissOfTournamentHandler } from "./PublicSwissOfTournamentHandler.js";
import {
  StandingsForApps,
  type StandingForApps,
  type StandingsToTell,
} from "./StandingsForApps.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/**
 * The standings of a block or a Swiss as the pages of the site show them,
 * which are read of the handlers of those pages so that the two cannot say
 * different things of one competition.
 */
export class StandingsForAppsHandler extends QueryHandler<
  StandingsForApps,
  StandingsToTell
> {
  readonly handles: RequestType<StandingsForApps> = StandingsForApps;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly changes: Pick<TournamentsByWebsite, "changedAtOfStreams">,
    private readonly blocks: PublicBlockOfTournamentHandler,
    private readonly swisses: PublicSwissOfTournamentHandler,
  ) {
    super();
  }

  async handle(query: StandingsForApps): Promise<StandingsToTell> {
    const { tournament, reference, shape, head } = await competitionFoundFor(
      this.tournaments,
      this.changes,
      query.website,
      query.tournament,
      query.competition,
      "StandingsForApps",
    );
    const address = tournament.address.toString();
    const slug = reference.slug.toString();

    if (shape.kind === "block") {
      const read = await this.blocks.handle(
        new PublicBlockOfTournament(query.website, address, slug),
      );
      const places = new Map(read.ranked.map((id, at) => [id, at]));
      return {
        competition: head,
        standings: [...read.players]
          .sort((one, other) => places.get(one.id)! - places.get(other.id)!)
          .map((player): StandingForApps => ({
            playerId: player.playerId,
            name: player.name,
            withdrawn: player.withdrawn,
            played: player.matchesWon + player.matchesLost,
            won: player.matchesWon,
            lost: player.matchesLost,
            gamesWon: player.gamesWon,
            netGames: player.netGames,
            netHoops: player.netHoops,
            position: player.placing?.place,
            shared: player.placing?.shared ?? false,
          })),
      };
    }

    if (shape.kind === "swiss") {
      const read = await this.swisses.handle(
        new PublicSwissOfTournament(query.website, address, slug),
      );
      const byId = new Map(read.players.map((player) => [player.id, player]));
      let place = 0;
      return {
        competition: head,
        standings: read.ranked.map((id): StandingForApps => {
          const player = byId.get(id)!;
          // A Swiss has no tied places: the order it is ranked in is the
          // places, and a player who has withdrawn has none.
          if (!player.withdrawn) place += 1;
          return {
            playerId: player.playerId,
            name: player.name,
            withdrawn: player.withdrawn,
            played: player.gamesPlayed,
            won: player.gamesWon,
            lost: undefined,
            gamesWon: undefined,
            netGames: undefined,
            netHoops: player.netHoops,
            position: player.withdrawn ? undefined : place,
            shared: false,
          };
        }),
      };
    }

    throw new TournamentOperationRefused(
      "StandingsForApps.NoStandings",
      "A knockout and a test have no standings.",
    );
  }
}
