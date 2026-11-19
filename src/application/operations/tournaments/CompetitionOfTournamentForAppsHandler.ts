import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { competitionFoundFor } from "./competitionForApps.js";
import {
  CompetitionOfTournamentForApps,
  type CompetitionToTell,
} from "./CompetitionOfTournamentForApps.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

export class CompetitionOfTournamentForAppsHandler extends QueryHandler<
  CompetitionOfTournamentForApps,
  CompetitionToTell
> {
  readonly handles: RequestType<CompetitionOfTournamentForApps> =
    CompetitionOfTournamentForApps;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly changes: Pick<TournamentsByWebsite, "changedAtOfStreams">,
  ) {
    super();
  }

  async handle(
    query: CompetitionOfTournamentForApps,
  ): Promise<CompetitionToTell> {
    const { tournament, reference, shape, head } = await competitionFoundFor(
      this.tournaments,
      this.changes,
      query.website,
      query.tournament,
      query.competition,
      "CompetitionOfTournamentForApps",
    );
    // A test has its own part of the tournament's address, as its page does.
    const part = shape.kind === "test" ? "tests" : "competitions";
    return {
      competition: head,
      address: `${tournament.address.toString()}/${part}/${reference.slug.toString()}`,
    };
  }
}
