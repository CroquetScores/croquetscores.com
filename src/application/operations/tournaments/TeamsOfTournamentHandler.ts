import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { type ListedTeam, TeamsOfTournament } from "./TeamsOfTournament.js";
import { managedOrRankedBy } from "./tournamentOperations.js";

export class TeamsOfTournamentHandler extends QueryHandler<
  TeamsOfTournament,
  readonly ListedTeam[]
> {
  readonly handles: RequestType<TeamsOfTournament> = TeamsOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: TeamsOfTournament): Promise<readonly ListedTeam[]> {
    const { tournament } = await managedOrRankedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "TeamsOfTournament",
    );
    // The tournament knows its tests, so whether a team is in one in use is
    // asked of it rather than of the games.
    const inTests = new Set(
      tournament.competitions.flatMap(({ reference, shape }) =>
        shape.kind === "test" && !reference.archived
          ? [shape.firstTeam.value, shape.secondTeam.value]
          : [],
      ),
    );
    return tournament.teams.map((team) => ({
      id: team.id.value,
      name: team.name.toString(),
      shortName: team.shortName.toString(),
      flag: team.flag === undefined ? undefined : String(team.flag),
      slug: team.slug.toString(),
      archived: team.archived,
      inATest: inTests.has(team.id.value),
    }));
  }
}
