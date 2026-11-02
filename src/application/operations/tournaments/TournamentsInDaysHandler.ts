import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  filterFor,
  type TournamentOfWebsite,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import {
  TOURNAMENTS_TO_A_PAGE,
  TournamentsInDays,
  type TournamentsPage,
} from "./TournamentsInDays.js";

// The whole range is sorted before it is cut, so the first page holds the first
// of what the reader sorted by. A stable sort leaves rows alike in it in the
// order the read model gave them, which is by start and then name. A day is
// written year first, so the writing sorts as the day does; names are ordered
// as the reader's language orders them.
const sortedBy = (
  every: readonly TournamentOfWebsite[],
  { sorting, language }: TournamentsInDays,
): readonly TournamentOfWebsite[] => {
  if (sorting === undefined) return every;
  const byName = new Intl.Collator(language);
  const compare =
    sorting.column === "date"
      ? (one: TournamentOfWebsite, other: TournamentOfWebsite): number =>
          one.starts < other.starts ? -1 : one.starts > other.starts ? 1 : 0
      : (one: TournamentOfWebsite, other: TournamentOfWebsite): number =>
          byName.compare(one.name, other.name);
  return [...every].sort((one, other) =>
    sorting.order === "up" ? compare(one, other) : compare(other, one),
  );
};

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
    // Every day a tournament can start on, which are those of the years a
    // tournament's address holds (TournamentAddress.ts), where none was chosen.
    const every = await this.byWebsite.startingBetween(
      website,
      filter.firstDay ?? "1000-01-01",
      filter.lastDay ?? "9999-12-31",
      filter,
    );
    const ordered = sortedBy(every, query);
    const from = (query.page - 1) * TOURNAMENTS_TO_A_PAGE;
    return {
      tournaments: ordered.slice(from, from + TOURNAMENTS_TO_A_PAGE),
      total: every.length,
      lastPage: Math.max(1, Math.ceil(every.length / TOURNAMENTS_TO_A_PAGE)),
    };
  }
}
