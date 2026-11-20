import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionStandings } from "./competitionStandings.js";
import {
  StandingsForApps,
  type StandingForApps,
  type StandingsToTell,
} from "./StandingsForApps.js";
import type { TournamentContents } from "./tournamentContents.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * The standings of a block or a Swiss as the pages of the site show them,
 * which are read of the same rows those pages read, so that the two cannot say
 * different things of one competition.
 */
export class StandingsForAppsHandler extends QueryHandler<
  StandingsForApps,
  StandingsToTell
> {
  readonly handles: RequestType<StandingsForApps> = StandingsForApps;

  constructor(
    private readonly contents: Pick<TournamentContents, "competition">,
    private readonly pages: Pick<TournamentPages, "namesOfPlayers">,
    private readonly standings: CompetitionStandings,
  ) {
    super();
  }

  async handle(query: StandingsForApps): Promise<StandingsToTell> {
    const found = await this.contents.competition(
      query.website,
      query.tournament,
      query.competition,
    );
    if (found.found === "no tournament") {
      throw new TournamentOperationRefused(
        "StandingsForApps.NoSuchTournament",
        "There is no such tournament.",
      );
    }
    if (found.found === "no competition") {
      throw new TournamentOperationRefused(
        "StandingsForApps.NoSuchCompetition",
        "There is no such competition.",
      );
    }
    const { head } = found;
    if (head.kind !== "block" && head.kind !== "swiss") {
      throw new TournamentOperationRefused(
        "StandingsForApps.NoStandings",
        "A knockout and a test have no standings.",
      );
    }
    const kept = await this.standings.standingsKept(head.id);
    // Who each line is, by the tournament's player the competition entered.
    // Players set aside are among them, as a line of one is still told.
    const known = await this.pages.namesOfPlayers(query.tournament);
    return {
      competition: head,
      // A line of a player the tournament does not have is left out, as it is
      // where the read models are not whole, rather than told as nobody.
      standings: kept.standings.flatMap((each): StandingForApps[] => {
        const name = known.get(each.tournamentPlayerId);
        if (name === undefined) return [];
        const block = head.kind === "block";
        return [
          {
            playerId: each.tournamentPlayerId,
            name,
            withdrawn: each.withdrawn,
            played: each.played,
            won: each.won,
            lost: each.lost,
            gamesWon: block ? each.gamesWon : undefined,
            netGames: block ? each.netGames : undefined,
            netHoops: each.netHoops,
            position: each.place,
            shared: each.shared,
          },
        ];
      }),
    };
  }
}
