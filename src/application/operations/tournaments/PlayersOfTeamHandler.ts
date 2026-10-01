import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Games } from "../../services/Games.js";
import { type ListedTeamPlayer, PlayersOfTeam } from "./PlayersOfTeam.js";
import { managedBy } from "./tournamentOperations.js";

export class PlayersOfTeamHandler extends QueryHandler<
  PlayersOfTeam,
  readonly ListedTeamPlayer[]
> {
  readonly handles: RequestType<PlayersOfTeam> = PlayersOfTeam;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(query: PlayersOfTeam): Promise<readonly ListedTeamPlayer[]> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "PlayersOfTeam",
    );
    const id = TeamId.from(query.team);
    const team = tournament.teams.find((each) => each.id.equals(id));
    if (team === undefined) {
      throw new TournamentRefused(
        "Tournament.NoSuchTeam",
        "The tournament has no such team.",
      );
    }
    const listed: ListedTeamPlayer[] = [];
    for (const player of team.players) {
      listed.push({
        id: player.id.value,
        name: player.name.toString(),
        archived: player.archived,
        // Asked of the games, as archiving a player asks, so that a list
        // offering to archive a player offers it only where it would be done.
        hasPlayed: await this.games.teamPlayerHasPlayed(
          tournament.id,
          player.id,
        ),
      });
    }
    return listed;
  }
}
