import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";
import { type TournamentAsPaged, TournamentPage } from "./TournamentPage.js";

export class TournamentPageHandler extends QueryHandler<
  TournamentPage,
  TournamentAsPaged
> {
  readonly handles: RequestType<TournamentPage> = TournamentPage;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(query: TournamentPage): Promise<TournamentAsPaged> {
    const id = await this.addresses.tournamentAt(query.address);
    const tournament =
      id === undefined ? undefined : await this.tournaments.load(id);
    if (tournament === undefined) {
      throw new TournamentOperationRefused(
        "UpdateTournament.NoSuchTournament",
        "No tournament has been found at that address.",
      );
    }
    const reader = AccountId.from(query.account);
    const part = tournament.manages(reader)
      ? "manager"
      : tournament.scores(reader)
        ? "scorer"
        : undefined;
    if (part === undefined) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager or a scorer of the tournament has a page of it.",
      );
    }
    if (tournament.archived) {
      throw new TournamentRefused(
        "Tournament.Archived",
        "An archived tournament can only be restored.",
      );
    }
    return {
      id: tournament.id.value,
      address: tournament.address.toString(),
      name: tournament.name.toString(),
      part,
      playedByTeams: tournament.format.isTeamFormat,
    };
  }
}
