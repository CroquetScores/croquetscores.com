import { CommentText } from "../../../domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddComment } from "./AddComment.js";

/** What a comment to be added must say, asked on the way in. */
export class AddCommentValidator extends CommandValidator<AddComment> {
  readonly validates: RequestType<AddComment> = AddComment;

  validate(command: AddComment): readonly BrokenRule<string>[] {
    return brokenBy("text", () => CommentText.from(command.text));
  }
}
