import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  CompetitionOfTournamentForApps,
  type CompetitionToTell,
} from "./CompetitionOfTournamentForApps.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentContents } from "./tournamentContents.js";

/**
 * A competition as an app is told of it, asked of the read models that keep
 * what is in a tournament, and so of nothing else. An id that is none is
 * refused as one there is not, since an app that mistyped an address has no
 * use for a finer answer, and so is an archived tournament or competition,
 * and a competition of another tournament.
 */
export class CompetitionOfTournamentForAppsHandler extends QueryHandler<
  CompetitionOfTournamentForApps,
  CompetitionToTell
> {
  readonly handles: RequestType<CompetitionOfTournamentForApps> =
    CompetitionOfTournamentForApps;

  constructor(private readonly read: Pick<TournamentContents, "competition">) {
    super();
  }

  async handle(
    query: CompetitionOfTournamentForApps,
  ): Promise<CompetitionToTell> {
    const found = await this.read.competition(
      query.website,
      query.tournament,
      query.competition,
    );
    if (found.found === "no tournament") {
      throw new TournamentOperationRefused(
        "CompetitionOfTournamentForApps.NoSuchTournament",
        "There is no such tournament.",
      );
    }
    if (found.found === "no competition") {
      throw new TournamentOperationRefused(
        "CompetitionOfTournamentForApps.NoSuchCompetition",
        "There is no such competition.",
      );
    }
    return { competition: found.head, address: found.address };
  }
}
