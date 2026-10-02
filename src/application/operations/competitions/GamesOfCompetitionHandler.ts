import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { askedBy, tournamentFor } from "../tournaments/tournamentOperations.js";
import {
  type Competitions,
  competitionOf,
  toldOf,
} from "./competitionOperations.js";
import { GamesOfCompetition, type ListedGame } from "./GamesOfCompetition.js";

export class GamesOfCompetitionHandler extends QueryHandler<
  GamesOfCompetition,
  readonly ListedGame[]
> {
  readonly handles: RequestType<GamesOfCompetition> = GamesOfCompetition;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(query: GamesOfCompetition): Promise<readonly ListedGame[]> {
    const by = await askedBy(this.accounts, query.account);
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "GamesOfCompetition",
    );
    if (!tournament.manages(by) && !tournament.scores(by)) {
      throw new TournamentRefused(
        "Tournament.NotAManagerOrScorer",
        "Only a manager or a scorer of the tournament can ask for this.",
      );
    }
    const id = CompetitionId.from(query.competition);
    const told = toldOf(tournament, id);
    const competition = await competitionOf(this.competitions, id);
    // Each player by what the tournament calls them now, so that a name
    // corrected there is corrected in every game of theirs.
    const names = new Map(
      tournament.players.map((player) => [
        player.id.value,
        player.name.toString(),
      ]),
    );
    // A test's games are between its teams' players, each by what their team
    // calls them now.
    const people = new Map([
      ...competition.players.map(
        (player) =>
          [
            player.id.value,
            names.get(player.tournamentPlayerId.value) ?? "",
          ] as const,
      ),
      ...tournament.teams.flatMap((team) =>
        team.players.map(
          (player) => [player.id.value, player.name.toString()] as const,
        ),
      ),
    ]);
    // The team each of a test's players plays for.
    const teams = new Map(
      tournament.teams.flatMap((team) =>
        team.players.map((player) => [player.id.value, team.id.value] as const),
      ),
    );
    return competition.games.map((game) => ({
      id: game.id.value,
      winner: people.get(game.winner.value) ?? "",
      winnerId: game.winner.value,
      winnerScore: String(game.winnerScore),
      loser: people.get(game.loser.value) ?? "",
      loserId: game.loser.value,
      loserScore: String(game.loserScore),
      archived: game.archived,
      archivable: competition.canBeArchived(game.id, told),
      winnerTeam: teams.get(game.winner.value),
      loserTeam: teams.get(game.loser.value),
    }));
  }
}
