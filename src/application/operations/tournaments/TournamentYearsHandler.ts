import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
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

  handle(query: TournamentYears): Promise<readonly number[]> {
    return this.byWebsite.yearsOf(Website.from(query.website));
  }
}
