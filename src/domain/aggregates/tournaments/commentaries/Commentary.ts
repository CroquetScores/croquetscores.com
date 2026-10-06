import { AccountId } from "../../accounts/AccountId.js";
import { AggregateRoot } from "../../../common/AggregateRoot.js";
import type { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { Refused } from "../../../common/Refused.js";
import { Slug } from "../../../common/Slug.js";
import { firstFree } from "../freeSlugs.js";
import type { CommentaryId } from "../primitives/CommentaryId.js";
import { TournamentId } from "../primitives/TournamentId.js";
import { CommentaryTitle } from "../value-objects/CommentaryTitle.js";
import { CommentaryCommentAdded } from "./events/CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "./events/CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "./events/CommentaryCommentEdited.js";
import { CommentaryStarted } from "./events/CommentaryStarted.js";
import { CommentaryTitleChanged } from "./events/CommentaryTitleChanged.js";
import { CommentId } from "./primitives/CommentId.js";
import { CommentText } from "./value-objects/CommentText.js";

/** Every reason a commentary refuses what it is asked. */
export type CommentaryErrorCode =
  | "Commentary.NotTheWriter"
  | "Commentary.TitleTaken"
  | "Commentary.NoSuchComment"
  | "Commentary.CommentAlreadyAdded";

/** A commentary's refusal, named by its code. */
export class CommentaryRefused extends Refused<CommentaryErrorCode> {}

const refuse = (code: CommentaryErrorCode, message: string): never => {
  throw new CommentaryRefused(code, message);
};

// Another commentary's title, however it is capitalised.
const refuseATitleTaken = (
  title: CommentaryTitle,
  taken: { readonly titles: readonly string[] },
): void => {
  if (taken.titles.some((other) => sameTitle(other, title.toString()))) {
    refuse("Commentary.TitleTaken", "Another commentary has the title.");
  }
};

/** One comment in a commentary, as it reads now. */
export interface Comment {
  readonly id: CommentId;
  readonly text: CommentText;
  readonly writtenAt: ReadOnlyDate;
  // When it was last edited, or nothing when it never has been.
  readonly lastEditedAt: ReadOnlyDate | undefined;
}

/**
 * What the other commentaries on a commentary's tournament have taken, which
 * none of them may have twice: their titles, however capitalised, and their
 * slugs. Told it by whatever starts a commentary or changes its title, from
 * the read model of a tournament's commentaries.
 */
export interface CommentariesTaken {
  readonly titles: readonly string[];
  readonly slugs: readonly string[];
}

// Where the page that starts a commentary is found among the tournament's
// commentaries, which no commentary may be found at too (start.feature).
const START_PAGE = "create";

// A title is the same title however it is capitalised, as a reader takes it.
const sameTitle = (one: string, other: string): boolean =>
  one.toLowerCase() === other.toLowerCase();

/**
 * One writer's account of a tournament as it is played: a title, and the
 * comments under it (start.feature). It is kept under its own id, as an
 * aggregate of its own rather than a part of the tournament, since a
 * tournament is read on every one of its pages and none of them needs its
 * commentaries but through the read model of them
 * (CommentariesByTournament.ts).
 *
 * Its writer is the account that started it, and the only account that may
 * change its title or add, edit or delete a comment in it. Whether its
 * tournament is archived it does not know, and whatever asks has asked the
 * tournament first (Tournament.allowWritingCommentary).
 */
export class Commentary extends AggregateRoot {
  #writer: AccountId | undefined;
  #tournament: TournamentId | undefined;
  #title: CommentaryTitle | undefined;
  #slug: Slug | undefined;
  // By the written id, in the order they were written. A deleted comment is
  // taken out, and its id kept in `#deleted`, so that no comment is ever
  // added under it again.
  readonly #comments = new Map<string, Comment>();
  readonly #deleted = new Set<string>();

  private constructor(id: CommentaryId) {
    super(id);
  }

  /**
   * A new commentary `id` on `tournament` called `title`, written by `by`,
   * which has no comments, found at the first slug of its title that none of
   * the tournament's other commentaries has. Refused when another has the
   * title, however it is capitalised.
   */
  static start(
    id: CommentaryId,
    tournament: TournamentId,
    title: CommentaryTitle,
    taken: CommentariesTaken,
    by: AccountId,
    at: ReadOnlyDate,
  ): Commentary {
    refuseATitleTaken(title, taken);
    const slug = firstFree(Slug.fromName(title.toString()), id, [
      START_PAGE,
      ...taken.slugs,
    ]);
    const commentary = new Commentary(id);
    commentary.record(
      new CommentaryStarted(
        tournament.value,
        title.toString(),
        slug.toString(),
        by.value,
        by,
        at,
      ),
    );
    return commentary;
  }

  /** The commentary its stream, `events`, leaves. */
  static rebuiltFrom(
    id: CommentaryId,
    events: readonly DomainEvent[],
  ): Commentary {
    const commentary = new Commentary(id);
    commentary.replay(events);
    return commentary;
  }

  override get id(): CommentaryId {
    return super.id;
  }

  /** The account that started it, and the only one that may write in it. */
  get writer(): AccountId {
    // Every commentary's stream begins by starting it, so one without is a
    // stream that was never a commentary's, and a mistake in whoever rebuilt
    // it rather than something to answer.
    if (this.#writer === undefined) {
      throw new Error("The commentary's stream did not begin by starting it.");
    }
    return this.#writer;
  }

  /** The tournament it is a commentary on. */
  get tournament(): TournamentId {
    return this.#started(this.#tournament);
  }

  get title(): CommentaryTitle {
    return this.#started(this.#title);
  }

  /**
   * Where it is found among its tournament's commentaries, made from its
   * title when it was started and kept when the title is changed.
   */
  get slug(): Slug {
    return this.#started(this.#slug);
  }

  // Every commentary's stream begins by starting it, so one without is a
  // stream that was never a commentary's.
  #started<T>(value: T | undefined): T {
    if (value === undefined) {
      throw new Error("The commentary's stream did not begin by starting it.");
    }
    return value;
  }

  /**
   * That the commentary is now called `title`, keeping its slug, so that
   * every link to it still finds it. Refused unless `by` is its writer, and
   * when another of the tournament's commentaries, of whose titles `others`
   * are, has the title however it is capitalised. A title changed to what it
   * is already records nothing.
   */
  changeTitle(
    title: CommentaryTitle,
    others: readonly string[],
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessWriter(by);
    refuseATitleTaken(title, { titles: others });
    if (this.title.equals(title)) return;
    this.record(new CommentaryTitleChanged(title.toString(), by, at));
  }

  /** Its comments not deleted, the first written first. */
  get comments(): readonly Comment[] {
    return [...this.#comments.values()];
  }

  /**
   * That `text` is added as the comment `id`, written now. Refused unless
   * `by` is its writer, and when a comment, deleted or not, has the id.
   */
  addComment(
    id: CommentId,
    text: CommentText,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessWriter(by);
    if (this.#comments.has(id.value) || this.#deleted.has(id.value)) {
      refuse("Commentary.CommentAlreadyAdded", "The comment is already added.");
    }
    this.record(new CommentaryCommentAdded(id.value, text.toString(), by, at));
  }

  /**
   * That the comment `id` now says `text`, keeping its place and when it was
   * written. Refused unless `by` is its writer, and when it has no such
   * comment, or has deleted it. An edit that changes nothing records nothing.
   */
  editComment(
    id: CommentId,
    text: CommentText,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessWriter(by);
    const found = this.#commentFound(id);
    if (found.text.equals(text)) return;
    this.record(new CommentaryCommentEdited(id.value, text.toString(), by, at));
  }

  /**
   * That the comment `id` is gone, for good. Refused as editing it is, and
   * deleting one already deleted is refused as one never there.
   */
  deleteComment(id: CommentId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessWriter(by);
    this.#commentFound(id);
    this.record(new CommentaryCommentDeleted(id.value, by, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof CommentaryStarted) {
      this.#writer = AccountId.from(event.writer);
      this.#tournament = TournamentId.from(event.tournamentId);
      this.#title = CommentaryTitle.from(event.title);
      this.#slug = Slug.from(event.slug);
    } else if (event instanceof CommentaryTitleChanged) {
      this.#title = CommentaryTitle.from(event.title);
    } else if (event instanceof CommentaryCommentAdded) {
      const id = CommentId.from(event.commentId);
      this.#comments.set(id.value, {
        id,
        text: CommentText.from(event.text),
        writtenAt: event.occurredAt,
        lastEditedAt: undefined,
      });
    } else if (event instanceof CommentaryCommentEdited) {
      const found = this.#comments.get(event.commentId);
      if (found !== undefined) {
        this.#comments.set(event.commentId, {
          ...found,
          text: CommentText.from(event.text),
          lastEditedAt: event.occurredAt,
        });
      }
    } else if (event instanceof CommentaryCommentDeleted) {
      this.#comments.delete(event.commentId);
      this.#deleted.add(event.commentId);
    }
  }

  // Asked before anything else, so that somebody who may not write in it is
  // told no more than that, whatever they asked for.
  #refuseUnlessWriter(by: AccountId): void {
    if (!this.writer.equals(by)) {
      refuse(
        "Commentary.NotTheWriter",
        "Only the commentary's writer can write in it.",
      );
    }
  }

  #commentFound(id: CommentId): Comment {
    return (
      this.#comments.get(id.value) ??
      refuse("Commentary.NoSuchComment", "The commentary has no such comment.")
    );
  }
}
