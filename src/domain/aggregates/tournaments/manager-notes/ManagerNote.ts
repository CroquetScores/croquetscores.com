import type { AccountId } from "../../accounts/AccountId.js";
import { AggregateRoot } from "../../../common/AggregateRoot.js";
import type { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { Refused } from "../../../common/Refused.js";
import type { ManagerNoteId } from "../primitives/ManagerNoteId.js";
import { TournamentId } from "../primitives/TournamentId.js";
import { ManagerNoteDescription } from "../value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../value-objects/ManagerNoteTitle.js";
import { ManagerNoteAdded } from "./events/ManagerNoteAdded.js";
import { ManagerNoteDeleted } from "./events/ManagerNoteDeleted.js";
import { ManagerNoteEdited } from "./events/ManagerNoteEdited.js";

/** Every reason a note refuses what it is asked. */
export type ManagerNoteErrorCode = "ManagerNote.Deleted";

/** A note's refusal, named by its code. */
export class ManagerNoteRefused extends Refused<ManagerNoteErrorCode> {}

/**
 * A note a tournament's managers wrote for its readers (add.feature): a title,
 * and a description in Markdown if the title does not say it all.
 *
 * It is kept under its own id, as an aggregate of its own rather than a part
 * of its tournament, as a commentary is, since a tournament is read on every
 * one of its pages and a note's description may be 750,000 characters long:
 * it is read only by whatever reads the note. What every page says of the
 * notes is kept for it by a read model (ManagerNotesByTournament.ts).
 *
 * Who may add, edit or delete one is its tournament's to say
 * (Tournament.allowWritingManagerNotes), and whatever asks has asked the
 * tournament first.
 */
export class ManagerNote extends AggregateRoot {
  #tournament: TournamentId | undefined;
  #title: ManagerNoteTitle | undefined;
  #description: ManagerNoteDescription | undefined;
  #writtenAt: ReadOnlyDate | undefined;
  #lastEditedAt: ReadOnlyDate | undefined;
  #deleted = false;

  private constructor(id: ManagerNoteId) {
    super(id);
  }

  /** A new note `id` of `tournament`, written by `by` now. */
  static add(
    id: ManagerNoteId,
    tournament: TournamentId,
    title: ManagerNoteTitle,
    description: ManagerNoteDescription | undefined,
    by: AccountId,
    at: ReadOnlyDate,
  ): ManagerNote {
    const note = new ManagerNote(id);
    note.record(
      new ManagerNoteAdded(
        tournament.value,
        title.toString(),
        description?.toString() ?? "",
        by,
        at,
      ),
    );
    return note;
  }

  /** The note its stream, `events`, leaves. */
  static rebuiltFrom(
    id: ManagerNoteId,
    events: readonly DomainEvent[],
  ): ManagerNote {
    const note = new ManagerNote(id);
    note.replay(events);
    return note;
  }

  override get id(): ManagerNoteId {
    return super.id;
  }

  // Every note's stream begins by adding it, so one without is a stream that
  // was never a note's, and a mistake in whoever rebuilt it rather than
  // something to answer.
  #added<T>(value: T | undefined): T {
    if (value === undefined) {
      throw new Error("The note's stream did not begin by adding it.");
    }
    return value;
  }

  /** The tournament it is a note of. */
  get tournament(): TournamentId {
    return this.#added(this.#tournament);
  }

  get title(): ManagerNoteTitle {
    return this.#added(this.#title);
  }

  /** What it says beneath its title, or nothing where it says nothing more. */
  get description(): ManagerNoteDescription | undefined {
    return this.#description;
  }

  get writtenAt(): ReadOnlyDate {
    return this.#added(this.#writtenAt);
  }

  /** When it was last edited, or nothing when it never has been. */
  get lastEditedAt(): ReadOnlyDate | undefined {
    return this.#lastEditedAt;
  }

  /** Whether it has been deleted, and is gone for good. */
  get deleted(): boolean {
    return this.#deleted;
  }

  /**
   * That the note is now called `title` and says `description`, keeping when
   * it was written. Refused once it is deleted. An edit that changes nothing
   * records nothing, so that a note is not made news to its readers again for
   * nothing.
   */
  edit(
    title: ManagerNoteTitle,
    description: ManagerNoteDescription | undefined,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseOnceDeleted();
    const sameDescription =
      this.#description === undefined
        ? description === undefined
        : this.#description.equals(description);
    if (this.title.equals(title) && sameDescription) return;
    this.record(
      new ManagerNoteEdited(
        title.toString(),
        description?.toString() ?? "",
        by,
        at,
      ),
    );
  }

  /** That the note is gone, for good. Refused once it is deleted already. */
  delete(by: AccountId, at: ReadOnlyDate): void {
    this.#refuseOnceDeleted();
    this.record(new ManagerNoteDeleted(by, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof ManagerNoteAdded) {
      this.#tournament = TournamentId.from(event.tournamentId);
      this.#title = ManagerNoteTitle.from(event.title);
      this.#description = ManagerNoteDescription.from(event.description);
      this.#writtenAt = event.occurredAt;
    } else if (event instanceof ManagerNoteEdited) {
      this.#title = ManagerNoteTitle.from(event.title);
      this.#description = ManagerNoteDescription.from(event.description);
      this.#lastEditedAt = event.occurredAt;
    } else if (event instanceof ManagerNoteDeleted) {
      this.#deleted = true;
    }
  }

  #refuseOnceDeleted(): void {
    if (this.#deleted) {
      throw new ManagerNoteRefused(
        "ManagerNote.Deleted",
        "The note is deleted.",
      );
    }
  }
}
