import { Id } from "../../../common/Id.js";

const kind = "manager-note";

/**
 * What a note a tournament's managers write is known by. Everything an id
 * does is on {@link Id}.
 */
export class ManagerNoteId extends Id {
  static create(): ManagerNoteId {
    return new ManagerNoteId(Id.mint(kind));
  }

  /** The manager note id written as `written`, or a validation refusal. */
  static from(written: string): ManagerNoteId {
    return new ManagerNoteId(Id.read(kind, written));
  }
}
