import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import { GamesForApps, type GamesToTell } from "./GamesForApps.js";
import { gamesToTell } from "./gamesToTell.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentContents } from "./tournamentContents.js";

/**
 * The games of a competition, asked of the read models kept for apps, and so of
 * nothing else: not of the events, and not of the competition as they would
 * rebuild it. A game's players are told by the id the tournament keeps them by,
 * which does not change. An id that is none is refused as one there is not,
 * since an app that mistyped an address has no use for a finer answer, and so
 * is an archived tournament or competition, and a competition of another
 * tournament.
 */
export class GamesForAppsHandler extends QueryHandler<
  GamesForApps,
  GamesToTell
> {
  readonly handles: RequestType<GamesForApps> = GamesForApps;

  constructor(
    private readonly contents: Pick<TournamentContents, "competition">,
    private readonly games: CompetitionGames,
  ) {
    super();
  }

  async handle(query: GamesForApps): Promise<GamesToTell> {
    const found = await this.contents.competition(
      query.website,
      query.tournament,
      query.competition,
    );
    if (found.found === "no tournament") {
      throw new TournamentOperationRefused(
        "GamesForApps.NoSuchTournament",
        "There is no such tournament.",
      );
    }
    if (found.found === "no competition") {
      throw new TournamentOperationRefused(
        "GamesForApps.NoSuchCompetition",
        "There is no such competition.",
      );
    }
    const { head } = found;
    const kept = await this.games.gamesKept(head.id);
    return {
      competition: head,
      ...gamesToTell(head.kind, kept, head.changedAt),
    };
  }
}
