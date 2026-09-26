// What a scenario about a tournament's operations is given to ask with: a plain
// shape, put on the world by whatever stands the operations up, since that
// names infrastructure and an application spec may not.
import type { Command } from "../../src/application/common/Command.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import type { TournamentId } from "../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../src/domain/aggregates/tournaments/Tournament.js";

export interface TournamentsInHand {
  /** Sends `command` to the application. Throws what the mediator throws. */
  send<TResult>(command: Command<TResult>): Promise<TResult>;

  /** The tournament `id` as its stream reads now, or nothing if it has none. */
  load(id: TournamentId): Promise<Tournament | undefined>;

  /** Every event of the tournament `id`, in the order they were kept. */
  eventsOf(id: TournamentId): Promise<readonly DomainEvent[]>;

  /** How many tournaments have been kept. */
  kept(): Promise<number>;

  /**
   * The id of the account for `address`, or nothing where there is none.
   * Asked of whatever made the scenario's accounts, which is registering for
   * an application scenario and the site itself for a browser scenario.
   */
  accountFor(address: string): Promise<AccountId | undefined>;

  /** The moment a request sent now is asked at, by the scenario's clock. */
  now(): ReadOnlyDate;

  /** What the games the operations ask say has been played, by id. */
  readonly games: {
    readonly playersWhoHavePlayed: Set<string>;
    readonly competitionsWithGames: Set<string>;
    readonly knockoutsWhoseChangeMovesAPlayer: Set<string>;
  };
}
