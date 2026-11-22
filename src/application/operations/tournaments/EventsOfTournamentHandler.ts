import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentEvents } from "../../services/TournamentEvents.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import {
  EventsOfTournament,
  type EventsOfTournamentAnswered,
} from "./EventsOfTournament.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class EventsOfTournamentHandler extends QueryHandler<
  EventsOfTournament,
  EventsOfTournamentAnswered
> {
  readonly handles: RequestType<EventsOfTournament> = EventsOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly events: TournamentEvents,
  ) {
    super();
  }

  async handle(query: EventsOfTournament): Promise<EventsOfTournamentAnswered> {
    // Who asks is looked at first, so that a reader who may not is told no
    // more than that, whether or not the tournament is there.
    await administratorAsking(this.accounts, query.account);
    // The address and not the tournament's aggregate: an archived tournament
    // has events too, and one that was moved still leads to it.
    const id = await this.addresses.tournamentAt(query.address);
    const tournament =
      id === undefined ? undefined : await this.tournaments.load(id);
    if (tournament === undefined) {
      throw new TournamentOperationRefused(
        "EventsOfTournament.NoSuchTournament",
        "No tournament has been found at that address.",
      );
    }
    return {
      name: tournament.name.toString(),
      events: await this.events.of(tournament.id),
    };
  }
}
