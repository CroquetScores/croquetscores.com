// The name each of a commentary's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import type { EventRegistry } from "../../../../common/EventRegistry.js";
import { CommentaryCommentAdded } from "./CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "./CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "./CommentaryCommentEdited.js";
import { CommentaryStarted } from "./CommentaryStarted.js";

type Said = Readonly<Record<string, unknown>>;

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at,
// and one that is there but is not what the event says there is refused the
// same. The registry says which event it was. Nothing a commentary's events
// say can be done without.
const unreadable = (field: string): never => {
  throw new TypeError(`it has no ${field} that can be read`);
};

const text = (said: Said, field: string): string => {
  const value = said[field];
  return typeof value === "string" ? value : unreadable(field);
};

/** `registry`, knowing every one of a commentary's events by its name. */
export const nameCommentaryEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      CommentaryStarted,
      "commentary-started",
      (said, { createdBy, occurredAt }) =>
        new CommentaryStarted(text(said, "writer"), createdBy, occurredAt),
    )
    .name(
      CommentaryCommentAdded,
      "commentary-comment-added",
      (said, { createdBy, occurredAt }) =>
        new CommentaryCommentAdded(
          text(said, "commentId"),
          text(said, "text"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CommentaryCommentEdited,
      "commentary-comment-edited",
      (said, { createdBy, occurredAt }) =>
        new CommentaryCommentEdited(
          text(said, "commentId"),
          text(said, "text"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CommentaryCommentDeleted,
      "commentary-comment-deleted",
      (said, { createdBy, occurredAt }) =>
        new CommentaryCommentDeleted(
          text(said, "commentId"),
          createdBy,
          occurredAt,
        ),
    );
