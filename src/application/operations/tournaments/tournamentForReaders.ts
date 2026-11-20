// What the pages of a tournament a reader follows share, whichever section of
// it they show: what its section bar leads to, and what a reader has yet to
// read of its notes and commentaries.
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";

/** A competition as a tournament's pages lead to it. */
export interface CompetitionOfTournament {
  /** What the competition is kept by, which never changes. */
  readonly id: string;
  readonly name: string;
  /** Where it is found, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
  /**
   * A test's two teams, by their short names as they are now, the first
   * team's first; nothing for any other competition.
   */
  readonly teams?:
    { readonly first: string; readonly second: string } | undefined;
  /**
   * The group a test is in, by its name as it was typed and the slug its page
   * is found at; nothing for a test in none, for one whose group makes no
   * slug, which has no page to be found at, and for any other competition.
   */
  readonly group?: { readonly name: string; readonly slug: string } | undefined;
}

/**
 * One of a tournament's notes as every page of the tournament knows it: enough
 * to tell whether a reader has read it as it is now, so that the page can mark
 * the Notes section while one is still to be read (notes.feature).
 */
export interface ManagerNoteChanged {
  /** The note's id, as "manager-note/0d1e2f3a-…". */
  readonly id: string;
  /** When it was last edited, or when it was written if it never has been. */
  readonly changedAt: ReadOnlyDate;
}

/**
 * Each of the notes of `tournament` with when it last changed, the most
 * recently written first, from the read model of its notes, which holds none
 * of what they say, since every page of the tournament asks for them.
 */
export const managerNotesChangedOf = async (
  notes: TournamentManagerNotes,
  tournament: Tournament,
): Promise<readonly ManagerNoteChanged[]> =>
  (await notes.of(tournament.id)).map(({ id, changedAt }) => ({
    id,
    changedAt,
  }));

/**
 * Where the page of the note found at `slug` among the notes of `tournament`
 * is found: the tournament's address followed by "notes" and the slug, as
 * "2026/ac/spring-open/notes/lunch-is-at-noon".
 */
export const noteAddressIn = (tournament: Tournament, slug: string): string =>
  `${tournament.address.toString()}/notes/${slug}`;

/**
 * One of a tournament's commentaries as every page of the tournament knows
 * it: enough to tell whether a reader has read it as it is now, so that the
 * page can mark the Commentary section while one is still to be read
 * (commentaries.feature).
 */
export interface CommentaryChanged {
  /** The commentary's id, as "commentary/0d1e2f3a-…". */
  readonly id: string;
  /**
   * When it was started, or when a comment was last added to it or edited in
   * it.
   */
  readonly changedAt: ReadOnlyDate;
}

/** One of a tournament's commentaries as a list of them shows it. */
export interface CommentaryListed extends CommentaryChanged {
  readonly title: string;
  /** Where it is found among its tournament's commentaries, as "day-one". */
  readonly slug: string;
  /** Its writer's account's id. */
  readonly writer: string;
}

/** A comment as a commentary's page reads it. */
export interface CommentRead {
  /** Its id, as the commentary's stream names it. */
  readonly id: string;
  readonly text: string;
  readonly writtenAt: ReadOnlyDate;
  /** When it was last edited, or nothing where it never has been. */
  readonly lastEditedAt: ReadOnlyDate | undefined;
}

/** A commentary as its own page reads it: its heading and its comments. */
export interface CommentaryRead {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  /** Its writer's account's id. */
  readonly writer: string;
  /** In the order they were written, those deleted left out. */
  readonly comments: readonly CommentRead[];
}

/**
 * The commentaries of each tournament, listed without any comment, and read
 * with their comments one at a time (CommentariesByTournament.feature). Where a list leaves out a commentary
 * whose writer has been forgotten, since a reader is shown nothing of it, its
 * title and slug are still taken.
 */
export interface TournamentCommentaries {
  /**
   * Each commentary of `tournament` with when it last changed, its writer
   * not forgotten.
   */
  of(tournament: TournamentId): Promise<readonly CommentaryChanged[]>;

  /**
   * The commentaries of `tournament`, the most recently started first, each
   * with its title, slug and writer, forgotten or not; a list asks its
   * writers' names, and leaves out those it cannot have.
   */
  listed(tournament: TournamentId): Promise<readonly CommentaryListed[]>;

  /** The id of the commentary of `tournament` found at `slug`, if any. */
  at(tournament: TournamentId, slug: string): Promise<string | undefined>;

  /**
   * The commentary of `tournament` found at `slug` with its comments, its
   * writer forgotten or not, or nothing where there is none there.
   */
  read(
    tournament: TournamentId,
    slug: string,
  ): Promise<CommentaryRead | undefined>;

  /**
   * The titles and slugs every commentary of `tournament` has taken, its
   * writer forgotten or not, apart from `except`'s own. Asked by a command
   * about to take one, so it holds every other asking of the tournament's
   * until the command's work is kept or not: two asked at once are then
   * answered one after the other, the second with what the first took, and
   * not both with the same title free (StartCommentary.feature).
   */
  taken(
    tournament: TournamentId,
    except?: string,
  ): Promise<{
    readonly titles: readonly string[];
    readonly slugs: readonly string[];
  }>;
}
