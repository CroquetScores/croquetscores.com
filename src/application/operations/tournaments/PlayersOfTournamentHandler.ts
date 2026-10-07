import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Games } from "../../services/Games.js";
import {
  type ListedPlayer,
  PlayersOfTournament,
} from "./PlayersOfTournament.js";
import type { Competitions } from "../competitions/competitionOperations.js";
import { managedOrRankedBy } from "./tournamentOperations.js";

export class PlayersOfTournamentHandler extends QueryHandler<
  PlayersOfTournament,
  readonly ListedPlayer[]
> {
  readonly handles: RequestType<PlayersOfTournament> = PlayersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(query: PlayersOfTournament): Promise<readonly ListedPlayer[]> {
    const { tournament } = await managedOrRankedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "PlayersOfTournament",
    );
    // Each competition's players, asked of the competition once, in the
    // tournament's order.
    const entered: { name: string; players: Set<string> }[] = [];
    for (const { reference } of tournament.competitions) {
      const competition = await this.competitions.load(reference.id);
      entered.push({
        name: reference.name.toString(),
        players: new Set(
          competition?.players.map(
            ({ tournamentPlayerId }) => tournamentPlayerId.value,
          ),
        ),
      });
    }
    const listed: ListedPlayer[] = [];
    for (const player of tournament.players) {
      listed.push({
        id: player.id.value,
        name: player.name.toString(),
        representing: player.representing,
        flag: player.flag === undefined ? undefined : String(player.flag),
        worldRankingName: player.worldRankingName?.toString(),
        archived: player.archived,
        // Asked of the games, as archiving a player asks, so that a list
        // offering to archive a player offers it only where it would be done.
        hasPlayed: await this.games.hasPlayed(tournament.id, player.id),
        competitions: entered
          .filter(({ players }) => players.has(player.id.value))
          .map(({ name }) => name),
      });
    }
    return listed;
  }
}
