import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  filterFor,
  type TournamentOfWebsite,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import { TournamentsInYear } from "./TournamentsInYear.js";

export class TournamentsInYearHandler extends QueryHandler<
  TournamentsInYear,
  readonly TournamentOfWebsite[]
> {
  readonly handles: RequestType<TournamentsInYear> = TournamentsInYear;

  constructor(private readonly byWebsite: TournamentsByWebsite) {
    super();
  }

  // Asked as the days from the year's first to its last, which the read model
  // already answers, a tournament's year being the year of the day it starts.
  handle(query: TournamentsInYear): Promise<readonly TournamentOfWebsite[]> {
    const website = Website.from(query.website);
    const year = String(query.year).padStart(4, "0");
    return this.byWebsite.startingBetween(
      website,
      `${year}-01-01`,
      `${year}-12-31`,
      filterFor(website, query.chose, "TournamentsInYear"),
    );
  }
}
