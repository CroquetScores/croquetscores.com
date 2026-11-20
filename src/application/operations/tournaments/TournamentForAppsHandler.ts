import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentContents } from "./tournamentContents.js";
import {
  TournamentForApps,
  type TournamentForAppsRead,
} from "./TournamentForApps.js";

/**
 * A tournament as an app is told of it, asked of the read models that keep
 * what is in a tournament (`TournamentContents.feature`) and so of nothing
 * else: not of the events, and not of the tournament as they would rebuild it.
 */
export class TournamentForAppsHandler extends QueryHandler<
  TournamentForApps,
  TournamentForAppsRead
> {
  readonly handles: RequestType<TournamentForApps> = TournamentForApps;

  constructor(private readonly read: Pick<TournamentContents, "tournament">) {
    super();
  }

  async handle(query: TournamentForApps): Promise<TournamentForAppsRead> {
    const found = await this.read.tournament(query.website, query.tournament);
    // What is not an id at all is no tournament there is, and is refused as
    // one, since an app that mistyped an address has no use for a finer
    // answer.
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "TournamentForApps.NoSuchTournament",
        "There is no such tournament.",
      );
    }
    return found;
  }
}
