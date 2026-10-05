import { Id } from "../../../common/Id.js";

const kind = "commentary";

/**
 * What a commentary on a tournament is known by, by the tournament and by the
 * commentary's own stream alike. Everything an id does is on {@link Id}.
 */
export class CommentaryId extends Id {
  static create(): CommentaryId {
    return new CommentaryId(Id.mint(kind));
  }

  /** The commentary id written as `written`, or a validation refusal. */
  static from(written: string): CommentaryId {
    return new CommentaryId(Id.read(kind, written));
  }
}
