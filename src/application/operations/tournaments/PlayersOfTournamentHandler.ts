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
import { managedBy } from "./tournamentOperations.js";

// As a reader looks for a name in a list: by its letters alone, so that
// "de Villiers" comes among the Ds and "Émile" among the Es. The same for
// every reader rather than by each one's language, since a list of people's
// names is not in any one language.
const byName = new Intl.Collator("en", { sensitivity: "base" });

export class PlayersOfTournamentHandler extends QueryHandler<
  PlayersOfTournament,
  readonly ListedPlayer[]
> {
  readonly handles: RequestType<PlayersOfTournament> = PlayersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(query: PlayersOfTournament): Promise<readonly ListedPlayer[]> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "PlayersOfTournament",
    );
    const listed: ListedPlayer[] = [];
    for (const player of tournament.players) {
      listed.push({
        id: player.id.value,
        name: player.name.toString(),
        representing: player.representing,
        flag: player.flag === undefined ? undefined : String(player.flag),
        archived: player.archived,
        // Asked of the games, as archiving a player asks, so that a list
        // offering to archive a player offers it only where it would be done.
        hasPlayed: await this.games.hasPlayed(tournament.id, player.id),
      });
    }
    return listed.sort((one, other) => byName.compare(one.name, other.name));
  }
}
