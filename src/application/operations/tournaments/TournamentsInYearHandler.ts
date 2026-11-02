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
  // A month is the days from its first to its last in the same way, and its
  // last day is the day before the next month's first, so that the length of
  // February in a leap year is the calendar's to say and not ours.
  handle(query: TournamentsInYear): Promise<readonly TournamentOfWebsite[]> {
    const website = Website.from(query.website);
    const year = String(query.year).padStart(4, "0");
    const month =
      query.month === undefined
        ? undefined
        : String(query.month).padStart(2, "0");
    const last =
      query.month === undefined
        ? `${year}-12-31`
        : `${year}-${month!}-${String(new Date(Date.UTC(query.year, query.month, 0)).getUTCDate())}`;
    return this.byWebsite.startingBetween(
      website,
      `${year}-${month ?? "01"}-01`,
      last,
      filterFor(website, query.chose, "TournamentsInYear"),
    );
  }
}
