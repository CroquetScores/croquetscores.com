import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { CompetitionNamesOfWebsite } from "./CompetitionNamesOfWebsite.js";
import type { SearchByWebsite } from "./searching.js";

/** The names of a website's competitions (competition.feature). */
export class CompetitionNamesOfWebsiteHandler extends QueryHandler<
  CompetitionNamesOfWebsite,
  readonly string[]
> {
  readonly handles: RequestType<CompetitionNamesOfWebsite> =
    CompetitionNamesOfWebsite;

  constructor(
    private readonly searched: Pick<SearchByWebsite, "competitionNamesOf">,
  ) {
    super();
  }

  handle(query: CompetitionNamesOfWebsite): Promise<readonly string[]> {
    return this.searched.competitionNamesOf(
      Website.from(query.website),
      query.tournament,
    );
  }
}
