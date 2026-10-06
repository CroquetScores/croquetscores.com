// What a scenario about a tournament's operations is given to ask with: a plain
// shape, put on the world by whatever stands the operations up, since that
// names infrastructure and an application spec may not.
import type { Command } from "../../src/application/common/Command.js";
import type { Query } from "../../src/application/common/Query.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import type { TournamentId } from "../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../src/domain/aggregates/tournaments/Tournament.js";
import type { Games } from "../../src/application/services/Games.js";
import type { Competition } from "../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionId } from "../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Commentary } from "../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import type { CommentaryId } from "../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { ManagerNoteHeading } from "../../src/application/operations/tournaments/managerNoteOperations.js";
import type { ManagerNote } from "../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";

export interface TournamentsInHand {
  /** Sends `command` to the application. Throws what the mediator throws. */
  send<TResult>(command: Command<TResult>): Promise<TResult>;

  /** Asks the application `query`. Throws what the mediator throws. */
  ask<TResult>(query: Query<TResult>): Promise<TResult>;

  /** The tournament `id` as its stream reads now, or nothing if it has none. */
  load(id: TournamentId): Promise<Tournament | undefined>;

  /** The note `id` as its stream reads now, or nothing if it has none. */
  loadManagerNote(id: ManagerNoteId): Promise<ManagerNote | undefined>;

  /**
   * Keeps `note` as an operation would, for what no request does just so,
   * such as a note added under an id the scenario names.
   */
  saveManagerNote(note: ManagerNote): Promise<void>;

  /** The notes of `tournament`, as the read model of them finds them. */
  managerNotesOf(
    tournament: TournamentId,
  ): Promise<readonly ManagerNoteHeading[]>;

  /** The competition `id` as its stream reads now, or nothing if it has none. */
  loadCompetition(id: CompetitionId): Promise<Competition | undefined>;

  /** The commentary `id` as its stream reads now, or nothing if it has none. */
  loadCommentary(id: CommentaryId): Promise<Commentary | undefined>;

  /**
   * Every event of the tournament, the competition or the commentary `id`, in
   * the order they were kept.
   */
  eventsOf(
    id: TournamentId | CompetitionId | CommentaryId | ManagerNoteId,
  ): Promise<readonly DomainEvent[]>;

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

  /** The application's games, as its operations ask them. */
  readonly games: Games;
}
