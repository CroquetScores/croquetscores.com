import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { TournamentNamesOfWebsite } from "./TournamentNamesOfWebsite.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/** The names of a website's tournaments (new.feature). */
export class TournamentNamesOfWebsiteHandler extends QueryHandler<
  TournamentNamesOfWebsite,
  readonly string[]
> {
  readonly handles: RequestType<TournamentNamesOfWebsite> =
    TournamentNamesOfWebsite;

  constructor(
    private readonly tournaments: Pick<TournamentsByWebsite, "namesOf">,
  ) {
    super();
  }

  handle(query: TournamentNamesOfWebsite): Promise<readonly string[]> {
    return this.tournaments.namesOf(Website.from(query.website));
  }
}
