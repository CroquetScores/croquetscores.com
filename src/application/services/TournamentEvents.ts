import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";

/** One event as it was kept, for an administrator to read. */
export interface KeptEvent {
  /** The kind of event it is, as it is kept: "tournament-created". */
  readonly kind: string;
  /** The stream it was kept in: "tournament/0d1e2f3a-…". */
  readonly stream: string;
  /** When it happened, as the event says: "2026-10-09T10:00:00.000Z". */
  readonly happenedAt: string;
  /** Everything the event carried, as it was kept. */
  readonly carried: Readonly<Record<string, unknown>>;
}

/**
 * Every event kept of a tournament, as it was kept. A tournament is not kept
 * in one stream: its own holds what happened to it, and each of its
 * competitions, commentaries and manager notes has one of its own.
 */
export interface TournamentEvents {
  /** The events of `tournament`, oldest first, in the order they were kept. */
  of(tournament: TournamentId): Promise<readonly KeptEvent[]>;
}
