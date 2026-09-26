// What a scenario about a tournament's operations is given to ask with: a plain
// shape, put on the world by whatever stands the operations up, since that
// names infrastructure and an application spec may not.
import type { Command } from "../../src/application/common/Command.js";
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

  /** What the games the operations ask say has been played, by id. */
  readonly games: {
    readonly playersWhoHavePlayed: Set<string>;
    readonly competitionsWithGames: Set<string>;
    readonly knockoutsWhoseChangeMovesAPlayer: Set<string>;
  };
}
