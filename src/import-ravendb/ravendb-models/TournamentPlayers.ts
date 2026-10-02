import type { Reference } from "./Tournament.js";

/**
 * A player as the old sites kept one in a tournament: numbered from 1 within
 * the tournament, and copied into each competition they were entered in under
 * the same number.
 */
export interface OldPlayer {
  readonly _Id: number;
  readonly Name: string;
  readonly Representing: string | null;
}

/**
 * The `TournamentPlayers` document holding every player of one tournament,
 * which it names. A knockout's byes are one player of it, called "Bye".
 */
export interface TournamentPlayers {
  readonly Tournament: Reference;
  readonly _Players: readonly OldPlayer[];
}
