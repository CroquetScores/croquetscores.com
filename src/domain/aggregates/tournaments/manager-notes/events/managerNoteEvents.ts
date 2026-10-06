// The name each of a manager's note's events is kept under, and how each is
// read back. A name is kept for good, and must never be given to anything
// else.
import type { EventRegistry } from "../../../../common/EventRegistry.js";
import { ManagerNoteAdded } from "./ManagerNoteAdded.js";
import { ManagerNoteDeleted } from "./ManagerNoteDeleted.js";
import { ManagerNoteEdited } from "./ManagerNoteEdited.js";

type Said = Readonly<Record<string, unknown>>;

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at,
// and one that is there but is not what the event says there is refused the
// same. The registry says which event it was. Nothing a note's events say can
// be done without.
const unreadable = (field: string): never => {
  throw new TypeError(`it has no ${field} that can be read`);
};

const text = (said: Said, field: string): string => {
  const value = said[field];
  return typeof value === "string" ? value : unreadable(field);
};

/** `registry`, knowing every one of a manager's note's events by its name. */
export const nameManagerNoteEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      ManagerNoteAdded,
      "manager-note-added",
      (said, { createdBy, occurredAt }) =>
        new ManagerNoteAdded(
          text(said, "tournamentId"),
          text(said, "title"),
          text(said, "description"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      ManagerNoteEdited,
      "manager-note-edited",
      (said, { createdBy, occurredAt }) =>
        new ManagerNoteEdited(
          text(said, "title"),
          text(said, "description"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      ManagerNoteDeleted,
      "manager-note-deleted",
      (_said, { createdBy, occurredAt }) =>
        new ManagerNoteDeleted(createdBy, occurredAt),
    );
