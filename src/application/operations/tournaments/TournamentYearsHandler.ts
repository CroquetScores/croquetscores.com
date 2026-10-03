import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import { sportsOffered } from "../../../domain/aggregates/tournaments/value-objects/sports.js";
import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";
import { TournamentYears } from "./TournamentYears.js";

export class TournamentYearsHandler extends QueryHandler<
  TournamentYears,
  readonly number[]
> {
  readonly handles: RequestType<TournamentYears> = TournamentYears;

  constructor(private readonly byWebsite: TournamentsByWebsite) {
    super();
  }

  // A sport there is not is refused as the sport refuses it, and one the
  // website does not offer as one no tournament of the website could be of.
  handle(query: TournamentYears): Promise<readonly number[]> {
    const website = Website.from(query.website);
    if (query.sport === undefined) return this.byWebsite.yearsOf(website);
    const sport = Sport.from(query.sport);
    if (!sportsOffered[website.site].some((offered) => offered.equals(sport))) {
      throw new TournamentOperationRefused(
        "TournamentYears.SportNotOffered",
        "The website does not offer the sport.",
      );
    }
    return this.byWebsite.yearsOf(website, sport);
  }
}
