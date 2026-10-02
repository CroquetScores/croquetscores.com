import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  filterFor,
  type TournamentOfWebsite,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import { UpcomingTournaments } from "./UpcomingTournaments.js";

// Sixty days from today is the last day a tournament may start on and be
// answered.
const DAYS_AHEAD = 60;

// The day of `moment` in UTC, as a tournament's days are kept, written as the
// year, the month and the day.
const dayOf = (moment: Date): string => moment.toISOString().slice(0, 10);

export class UpcomingTournamentsHandler extends QueryHandler<
  UpcomingTournaments,
  readonly TournamentOfWebsite[]
> {
  readonly handles: RequestType<UpcomingTournaments> = UpcomingTournaments;

  constructor(private readonly byWebsite: TournamentsByWebsite) {
    super();
  }

  handle(query: UpcomingTournaments): Promise<readonly TournamentOfWebsite[]> {
    const website = Website.from(query.website);
    const at = query.at.toDate();
    const today = Date.UTC(
      at.getUTCFullYear(),
      at.getUTCMonth(),
      at.getUTCDate(),
    );
    const last = new Date(today);
    last.setUTCDate(last.getUTCDate() + DAYS_AHEAD);
    return this.byWebsite.startingBetween(
      website,
      dayOf(new Date(today)),
      dayOf(last),
      filterFor(website, query.chose, "UpcomingTournaments"),
    );
  }
}
