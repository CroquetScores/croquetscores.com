import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  filterFor,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import {
  TOURNAMENTS_TO_A_PAGE,
  TournamentsInDays,
  type TournamentsPage,
} from "./TournamentsInDays.js";

export class TournamentsInDaysHandler extends QueryHandler<
  TournamentsInDays,
  TournamentsPage
> {
  readonly handles: RequestType<TournamentsInDays> = TournamentsInDays;

  constructor(private readonly byWebsite: TournamentsByWebsite) {
    super();
  }

  // The read model answers every tournament in the days and the pages are cut
  // here, so that every page that asks cuts them in the same places. Asking
  // the database for a page at a time was the other way to do it, and would be
  // the way if a website's tournaments in one range ever outgrew memory.
  async handle(query: TournamentsInDays): Promise<TournamentsPage> {
    const website = Website.from(query.website);
    const filter = filterFor(
      website,
      { ...query.chose, firstDay: query.firstDay, lastDay: query.lastDay },
      "TournamentsInDays",
    );
    const every = await this.byWebsite.startingBetween(
      website,
      query.firstDay,
      query.lastDay,
      filter,
    );
    const from = (query.page - 1) * TOURNAMENTS_TO_A_PAGE;
    return {
      tournaments: every.slice(from, from + TOURNAMENTS_TO_A_PAGE),
      total: every.length,
      lastPage: Math.max(1, Math.ceil(every.length / TOURNAMENTS_TO_A_PAGE)),
    };
  }
}
