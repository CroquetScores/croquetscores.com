import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
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
  readerAs,
} from "./tournamentOperations.js";
import {
  type ChangingTournament,
  TournamentToChange,
} from "./TournamentToChange.js";

// A day as a form writes it: the year, the month and the day, in UTC, which is
// where a tournament's days are kept.
const dayOf = (moment: { toISOString(): string }): string =>
  moment.toISOString().slice(0, 10);

export class TournamentToChangeHandler extends QueryHandler<
  TournamentToChange,
  ChangingTournament
> {
  readonly handles: RequestType<TournamentToChange> = TournamentToChange;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: TournamentToChange): Promise<ChangingTournament> {
    const id = await this.addresses.tournamentAt(query.address);
    const tournament =
      id === undefined ? undefined : await this.tournaments.load(id);
    if (tournament === undefined) {
      throw new TournamentOperationRefused(
        "UpdateTournament.NoSuchTournament",
        "No tournament has been found at that address.",
      );
    }
    if (!tournament.mayManage(await readerAs(this.accounts, query.account))) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager of the tournament can change it.",
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
      starts: dayOf(tournament.starts),
      finishes: dayOf(tournament.finishes),
      format: tournament.format.name,
      sport: tournament.sport.code,
      country: tournament.country.code,
      region: tournament.region?.code,
      subtitle: tournament.subtitle?.markdown,
      handicap: tournament.handicap,
      drawsAllowed: tournament.drawsAllowed,
      levelTestsDrawn: tournament.levelTestsDrawn,
      worldRankings: tournament.worldRankings,
      national: tournament.national,
      international: tournament.international,
    };
  }
}
