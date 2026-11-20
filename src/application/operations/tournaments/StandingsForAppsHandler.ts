import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { competitionFoundFor } from "./competitionForApps.js";
import type { CompetitionStandings } from "./competitionStandings.js";
import {
  StandingsForApps,
  type StandingForApps,
  type StandingsToTell,
} from "./StandingsForApps.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/**
 * The standings of a block or a Swiss as the pages of the site show them,
 * which are read of the same rows those pages read, so that the two cannot say
 * different things of one competition.
 */
export class StandingsForAppsHandler extends QueryHandler<
  StandingsForApps,
  StandingsToTell
> {
  readonly handles: RequestType<StandingsForApps> = StandingsForApps;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly changes: Pick<TournamentsByWebsite, "changesOfTournament">,
    private readonly standings: CompetitionStandings,
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
    if (shape.kind !== "block" && shape.kind !== "swiss") {
      throw new TournamentOperationRefused(
        "StandingsForApps.NoStandings",
        "A knockout and a test have no standings.",
      );
    }
    const kept = await this.standings.standingsKept(reference.id.value);
    // Who each line is, by the tournament's player the competition entered.
    const known = new Map(
      tournament.players.map((player) => [player.id.value, player]),
    );
    return {
      competition: head,
      // A line of a player the tournament does not have is left out, as it is
      // where the read models are not whole, rather than told as nobody.
      standings: kept.standings.flatMap((each): StandingForApps[] => {
        const player = known.get(each.tournamentPlayerId);
        if (player === undefined) return [];
        const block = shape.kind === "block";
        return [
          {
            playerId: player.id.value,
            name: player.name.toString(),
            withdrawn: each.withdrawn,
            played: each.played,
            won: each.won,
            lost: each.lost,
            gamesWon: block ? each.gamesWon : undefined,
            netGames: block ? each.netGames : undefined,
            netHoops: each.netHoops,
            position: each.place,
            shared: each.shared,
          },
        ];
      }),
    };
  }
}
