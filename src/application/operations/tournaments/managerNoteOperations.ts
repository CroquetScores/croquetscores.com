// What the operations on a tournament's notes share: what a note must be,
// asked on the way in, the title's rules before the description's, as the
// panel asks them; the read model that finds a tournament's notes without
// reading what they say; and finding a note of a tournament.
import { ManagerNoteDescription } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { brokenBy } from "../../common/brokenBy.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";

/** Every rule of its own a note's `title` and `description` break. */
export const brokenByManagerNote = ({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}): readonly BrokenRule[] => [
  ...brokenBy("title", () => ManagerNoteTitle.from(title)),
  ...brokenBy("description", () => ManagerNoteDescription.from(description)),
];

/** A note as a tournament's pages list it: everything but what it says. */
export interface ManagerNoteHeading {
  /** Its id, as "manager-note/0d1e2f3a-…". */
  readonly id: string;
  readonly title: string;
  /** Where it is found among its tournament's notes, as "lunch-is-at-noon". */
  readonly slug: string;
  readonly writtenAt: ReadOnlyDate;
  /** When it was last edited, or when it was written if it never has been. */
  readonly changedAt: ReadOnlyDate;
}

/**
 * The notes of each tournament, without their descriptions, which a list
 * has no use for and which may be 750,000 characters long
 * (ManagerNotesByTournament.feature).
 */
export interface TournamentManagerNotes {
  /** The notes of `tournament` not deleted, the most recently written first. */
  of(tournament: TournamentId): Promise<readonly ManagerNoteHeading[]>;

  /**
   * The id of the note of `tournament` found at `slug`, or nothing where no
   * note not deleted is found there.
   */
  noteAt(tournament: TournamentId, slug: string): Promise<string | undefined>;

  /**
   * Every slug the notes of `tournament` have, deleted or not, since a
   * deleted note's slug is never given to another (add.feature). Asked by a
   * command about to take one, so it holds every other asking of the
   * tournament's until the command's work is kept or not: two asked at once
   * are then answered one after the other, the second with the slug the first
   * took (AddManagerNote.feature).
   */
  slugsTakenIn(tournament: TournamentId): Promise<readonly string[]>;
}

/**
 * The note `written` of `tournament`, or refused as `operation`'s
 * `NoSuchManagerNote`: where there is no such note, where it is another
 * tournament's, since a note is found under the tournament it is of, and where
 * what was written is no note's id at all. A deleted note is answered, for the
 * note to refuse what it is asked.
 */
export const managerNoteOf = async (
  notes: AggregateRepository<ManagerNote, ManagerNoteId>,
  tournament: TournamentId,
  written: string,
  operation: string,
): Promise<ManagerNote> => {
  let id: ManagerNoteId | undefined;
  try {
    id = ManagerNoteId.from(written);
  } catch {
    id = undefined;
  }
  const note = id === undefined ? undefined : await notes.load(id);
  if (note === undefined || !note.tournament.equals(tournament)) {
    throw new TournamentOperationRefused(
      `${operation}.NoSuchManagerNote`,
      "The tournament has no such note.",
    );
  }
  return note;
};
