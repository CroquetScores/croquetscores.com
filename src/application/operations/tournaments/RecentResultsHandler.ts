import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { RecentResults } from "./RecentResults.js";
import {
  filterFor,
  type TournamentPlayed,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";

// Counted back to the minute rather than to the start of a day, so that a game
// added a week ago this morning is recent this morning and not this afternoon.
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export class RecentResultsHandler extends QueryHandler<
  RecentResults,
  readonly TournamentPlayed[]
> {
  readonly handles: RequestType<RecentResults> = RecentResults;

  constructor(private readonly byWebsite: TournamentsByWebsite) {
    super();
  }

  handle(query: RecentResults): Promise<readonly TournamentPlayed[]> {
    const website = Website.from(query.website);
    return this.byWebsite.playedSince(
      website,
      ReadOnlyDate.from(new Date(query.at.toDate().getTime() - SEVEN_DAYS)),
      filterFor(website, query.chose, "RecentResults"),
    );
  }
}
