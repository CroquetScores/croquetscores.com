import { CommentText } from "../../../domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenBy } from "../tournaments/tournamentOperations.js";
import { EditComment } from "./EditComment.js";

/** What a comment is to say once edited, asked on the way in. */
export class EditCommentValidator extends CommandValidator<EditComment> {
  readonly validates: RequestType<EditComment> = EditComment;

  validate(command: EditComment): readonly BrokenRule<string>[] {
    return brokenBy("text", () => CommentText.from(command.text));
  }
}
