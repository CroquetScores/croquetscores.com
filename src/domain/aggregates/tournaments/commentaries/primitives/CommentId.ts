import { Id } from "../../../../common/Id.js";

const kind = "comment";

/**
 * What a comment written in a commentary is known by. Two comments saying the
 * same thing are still two comments, so a comment is known by its id and not
 * by what it says. Everything an id does is on {@link Id}.
 */
export class CommentId extends Id {
  static create(): CommentId {
    return new CommentId(Id.mint(kind));
  }

  /** The comment id written as `written`, or a validation refusal. */
  static from(written: string): CommentId {
    return new CommentId(Id.read(kind, written));
  }
}
